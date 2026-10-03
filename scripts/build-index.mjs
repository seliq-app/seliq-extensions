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
const CONFIG_NAMES = ["Config.json", "Config.yaml", "Config.yml", "Config.js", "Config.ts", "Config.plist", "Config.applescript"];

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
    const cm = n.endsWith(".applescript") ? "--" : "//";
    for (const line of lines) {
      let l = line;
      if (n.endsWith(".js") || n.endsWith(".ts") || n.endsWith(".applescript")) {
        if (!l.trim().startsWith(cm) && l.trim() !== "") break; // end of leading comment header
        l = l.replace(new RegExp(`^\\s*${cm} ?`), "");
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

// File icon (png/svg) referenced by the extension's Config `icon:`; returns an absolute path inside ext/ or null.
function readIconFile(extPath) {
  const v = readConfigValue(extPath, "icon");
  if (!v) return null;
  const rel = v.replace(/^file:/i, "").trim();
  if (!/\.(png|svg)$/i.test(rel)) return null;
  const abs = path.resolve(extPath, rel);
  if (!abs.startsWith(extPath + path.sep) || !fs.existsSync(abs) || !fs.statSync(abs).isFile() || fs.statSync(abs).size > 200 * 1024) return null;
  return abs;
}

const strOrNull = (v) => (typeof v === "string" && v.length > 0 ? v : null);

fs.rmSync(siteDir, { recursive: true, force: true });
fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(path.join(siteDir, "dl"), { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const entries = [];
const iconFiles = {};
const shortcodes = fs.existsSync(extDir)
  ? fs.readdirSync(extDir, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort()
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
  for (const k of ["category", "icon", "upstream", "origin"]) {
    if (meta[k] != null && typeof meta[k] !== "string") { err(sc, `meta.json: "${k}" must be a string`); ok = false; }
  }
  const LANGS = ["ko", "ja", "zh-Hans", "zh-Hant", "de", "fr", "es"];
  if (meta.descriptions != null && (typeof meta.descriptions !== "object" || Array.isArray(meta.descriptions) ||
      Object.entries(meta.descriptions).some(([l, v]) => !LANGS.includes(l) || typeof v !== "string" || v.trim() === ""))) {
    err(sc, `meta.json: "descriptions" must map ${LANGS.join("/")} to non-empty strings`); ok = false;
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

  const iconAbs = readIconFile(src);
  if (iconAbs) {
    const ext = path.extname(iconAbs).toLowerCase();
    fs.mkdirSync(path.join(siteDir, "icons"), { recursive: true });
    fs.copyFileSync(iconAbs, path.join(siteDir, "icons", `${sc}${ext}`));
    iconFiles[sc] = `icons/${sc}${ext}`;
  }

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
    origin: strOrNull(meta.origin),
    descriptions: meta.descriptions ?? null,
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

fs.writeFileSync(path.join(siteDir, "icon-files.json"), JSON.stringify(iconFiles, null, 1) + "\n");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const li = (e) => `<li><a href="${esc(e.download)}">${esc(e.name)}</a> ${esc(e.version)}${e.origin === "popclip" ? " <small>[PopClip]</small>" : ""} &mdash; ${esc(e.description)}</li>`;
const listed = entries.filter((e) => !e.unlisted);
const isContrib = (e) => e.category === "PopClip Contrib";
const popclipRows = listed.filter((e) => e.origin === "popclip" && !isContrib(e)).map(li).join("\n");
const contribRows = listed.filter((e) => e.origin === "popclip" && isContrib(e)).map(li).join("\n");
const otherRows = listed.filter((e) => e.origin !== "popclip").map(li).join("\n");
// no-JS fallback: the plain list, shown inside <noscript> of the store page
const fallback =
  `<h1>Seliq Extensions</h1>\n<p>Extension store for Seliq (PopClip-compatible). Machine-readable: <a href="index.json">index.json</a></p>\n` +
  `<p><strong>PopClip extensions.</strong> Entries marked [PopClip] are PopClip extensions by Pilotmoon (Nicholas Moore) and contributors, taken unmodified from <a href="https://github.com/pilotmoon/PopClip-Extensions">pilotmoon/PopClip-Extensions</a> under the MIT License and provided for compatibility. Seliq is not affiliated with or endorsed by PopClip or Pilotmoon. PopClip extensions &mdash; 이 항목들은 Pilotmoon과 기여자가 만든 PopClip 확장이며 수정 없이 MIT 라이선스로 호환을 위해 제공됩니다. Seliq은 PopClip/Pilotmoon과 제휴 관계가 아닙니다.</p>\n` +
  (otherRows ? `<h2>Seliq</h2>\n<ul>\n${otherRows}\n</ul>\n` : "") +
  `<h2>PopClip extensions (${listed.filter((e) => e.origin === "popclip" && !isContrib(e)).length})</h2>\n<ul>\n${popclipRows}\n</ul>\n` +
  (contribRows ? `<h2>PopClip Contrib (${listed.filter(isContrib).length})</h2>\n<p>From the upstream <code>contrib</code> folder: user-contributed, experimental or niche extensions that may be outdated, provided as-is. contrib 폴더에서 가져온 사용자 기여·실험·니치 확장으로, 오래되었을 수 있으며 있는 그대로 제공됩니다.</p>\n<ul>\n${contribRows}\n</ul>\n` : "");

// store page: scripts/site/{index.html,store.css,store.js} -> _site (assets get a content-hash cache query)
const siteSrc = path.join(root, "scripts", "site");
let page = fs.readFileSync(path.join(siteSrc, "index.html"), "utf8");
for (const f of ["store.css", "store.js"]) {
  const data = fs.readFileSync(path.join(siteSrc, f));
  fs.writeFileSync(path.join(siteDir, f), data);
  page = page.replaceAll(`${f}?v=__V__`, `${f}?v=${createHash("sha256").update(data).digest("hex").slice(0, 8)}`);
}
fs.copyFileSync(path.join(siteSrc, "seliq-icon.svg"), path.join(siteDir, "seliq-icon.svg"));
fs.writeFileSync(path.join(siteDir, "index.html"), page.replace("<!--NOSCRIPT-->", fallback));

console.log(`OK: ${entries.length} extensions -> ${path.relative(root, siteDir)}/`);
