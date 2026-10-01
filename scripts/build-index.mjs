#!/usr/bin/env node
// Validates extensions/*/meta.json, builds _site/dl/*.popclipextz and _site/index.json.
// Node built-ins + system `zip` only.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extDir = path.join(root, "extensions");
const siteDir = path.join(root, "_site");
const tmpDir = path.join(root, ".tmp-build");
const BASE = "https://seliq-app.github.io/seliq-extensions";
const MAX_ZIP = 5 * 1024 * 1024;
const FIXED_MTIME = new Date("2026-01-01T00:00:00Z");
const SHORTCODE_RE = /^[a-z0-9-]+$/;
const VERSION_RE = /^[A-Za-z0-9._+-]+$/;
const FILENAME_RE = /^[a-z0-9-]+-[A-Za-z0-9._+-]+\.popclipextz$/;
const CONFIG_NAMES = ["Config.json", "Config.yaml", "Config.yml", "Config.js", "Config.ts", "Config.plist"];

const errors = [];
const err = (sc, msg) => errors.push(`[${sc}] ${msg}`);

function walk(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, base));
    else if (e.isFile()) out.push(path.relative(base, p).split(path.sep).join("/"));
  }
  return out.sort();
}

const unquote = (v) => v.trim().replace(/^(["'])(.*)\1$/, "$2").trim();

// Returns the top-level `key` value of an extension Config, or null.
// JSON: parsed; YAML: top-level `key:` line; JS/TS: `// key:` within the leading comment header only.
function readConfigValue(extPath, key) {
  for (const n of CONFIG_NAMES) {
    const f = path.join(extPath, n);
    if (!fs.existsSync(f)) continue;
    const text = fs.readFileSync(f, "utf8");
    const lines = text.split(/\r?\n/);
    if (n.endsWith(".json")) {
      try { const v = JSON.parse(text)[key]; return typeof v === "string" && v ? v : null; } catch { return null; }
    }
    if (n.endsWith(".plist")) {
      if (key !== "identifier") return null;
      const m = text.match(/<key>Extension Identifier<\/key>\s*<string>([^<]+)<\/string>/);
      return m ? m[1].trim() : null;
    }
    const re = new RegExp(`^${key}\\s*:\\s*(.+)$`);
    for (const line of lines) {
      let l = line;
      if (n.endsWith(".js") || n.endsWith(".ts")) {
        if (!/^\s*\/\//.test(l) && l.trim() !== "") break; // end of leading comment header
        l = l.replace(/^\s*\/\/ ?/, "");
        if (/^\s/.test(l)) continue;
      }
      const m = l.match(re);
      if (m) { const v = unquote(m[1]); return v || null; }
    }
    return null;
  }
  return null;
}

const readIdentifier = (extPath) => readConfigValue(extPath, "identifier");

// Text-style icon specs only (symbol:/iconify:/text:/PopClip text icons); file icons -> null.
function readIcon(extPath) {
  const v = readConfigValue(extPath, "icon");
  if (!v || /^file:/i.test(v) || /\.(png|svg|pdf|jpe?g|tiff|gif)$/i.test(v)) return null;
  return v;
}

const strOrNull = (v) => (typeof v === "string" && v.length > 0 ? v : null);

fs.rmSync(siteDir, { recursive: true, force: true });
fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(path.join(siteDir, "dl"), { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const entries = [];
const shortcodes = fs.existsSync(extDir)
  ? fs.readdirSync(extDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()
  : [];

for (const sc of shortcodes) {
  if (!SHORTCODE_RE.test(sc)) { err(sc, "shortcode must match [a-z0-9-]+"); continue; }
  const dir = path.join(extDir, sc);
  const metaFile = path.join(dir, "meta.json");
  const src = path.join(dir, "ext");
  if (!fs.existsSync(metaFile)) { err(sc, "meta.json missing"); continue; }
  if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) { err(sc, "ext/ directory missing"); continue; }
  let meta;
  try { meta = JSON.parse(fs.readFileSync(metaFile, "utf8")); }
  catch (e) { err(sc, `meta.json is not valid JSON: ${e.message}`); continue; }
  let ok = true;
  for (const k of ["name", "description", "version", "license"]) {
    if (typeof meta[k] !== "string" || meta[k].trim() === "") { err(sc, `meta.json: "${k}" is required (non-empty string)`); ok = false; }
  }
  if (ok && (!VERSION_RE.test(meta.version) || meta.version.includes("..") || !FILENAME_RE.test(`${sc}-${meta.version}.popclipextz`))) { err(sc, 'meta.json: "version" must match [A-Za-z0-9._+-]+ and not contain ".."'); ok = false; }
  for (const k of ["category", "icon", "upstream"]) {
    if (meta[k] != null && typeof meta[k] !== "string") { err(sc, `meta.json: "${k}" must be a string`); ok = false; }
  }
  if (meta.unlisted != null && typeof meta.unlisted !== "boolean") { err(sc, 'meta.json: "unlisted" must be boolean'); ok = false; }
  const files = walk(src);
  if (files.length === 0) { err(sc, "ext/ is empty"); ok = false; }
  if (!files.some((f) => CONFIG_NAMES.includes(f))) { err(sc, "ext/ has no Config.* file"); ok = false; }
  if (!ok) continue;

  // Stage with normalized mtimes, then zip with a sorted file list.
  const folder = `${sc}.popclipext`;
  const stage = path.join(tmpDir, sc);
  fs.mkdirSync(stage, { recursive: true });
  fs.cpSync(src, path.join(stage, folder), { recursive: true });
  const staged = walk(path.join(stage, folder)).map((f) => `${folder}/${f}`);
  const dirs = new Set([folder]);
  for (const f of staged) { let d = path.posix.dirname(f); while (d !== ".") { dirs.add(d); d = path.posix.dirname(d); } }
  for (const p of [...staged, ...dirs]) fs.utimesSync(path.join(stage, p), FIXED_MTIME, FIXED_MTIME);

  const fname = `${sc}-${meta.version}.popclipextz`;
  const outFile = path.join(siteDir, "dl", fname);
  const r = spawnSync("zip", ["-X", "-q", "-@", outFile], {
    cwd: stage,
    input: [...[...dirs].sort().map((d) => `${d}/`), ...staged].join("\n") + "\n",
    env: { ...process.env, TZ: "UTC" },
  });
  if (r.status !== 0) { err(sc, `zip failed: ${r.stderr?.toString() || r.error?.message}`); continue; }
  const buf = fs.readFileSync(outFile);
  if (buf.length > MAX_ZIP) { err(sc, `archive is ${buf.length} bytes (> ${MAX_ZIP})`); continue; }

  entries.push({
    shortcode: sc,
    identifier: readIdentifier(src),
    name: meta.name,
    description: meta.description,
    version: meta.version,
    category: strOrNull(meta.category),
    icon: strOrNull(meta.icon) ?? readIcon(src),
    download: `${BASE}/dl/${fname}`,
    sha256: createHash("sha256").update(buf).digest("hex"),
    size: buf.length,
    license: meta.license,
    upstream: strOrNull(meta.upstream),
    unlisted: meta.unlisted === true,
  });
}

fs.rmSync(tmpDir, { recursive: true, force: true });

if (errors.length > 0) {
  console.error("Validation errors:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

entries.sort((a, b) => a.name.localeCompare(b.name, "en") || a.shortcode.localeCompare(b.shortcode));
const index = { schema: 1, generated: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"), extensions: entries };
fs.writeFileSync(path.join(siteDir, "index.json"), JSON.stringify(index, null, 2) + "\n");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const rows = entries.filter((e) => !e.unlisted)
  .map((e) => `<li><a href="${esc(e.download)}">${esc(e.name)}</a> ${esc(e.version)} &mdash; ${esc(e.description)}</li>`).join("\n");
fs.writeFileSync(path.join(siteDir, "index.html"),
  `<!doctype html>\n<meta charset="utf-8">\n<title>Seliq Extensions</title>\n<h1>Seliq Extensions</h1>\n<p>Extension store for Seliq (PopClip-compatible). Machine-readable: <a href="index.json">index.json</a></p>\n<ul>\n${rows}\n</ul>\n`);

console.log(`OK: ${entries.length} extensions -> ${path.relative(root, siteDir)}/`);
