/* ===== Seliq Extensions store — fetches ./index.json and renders the catalog ===== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const body = document.body;

  /* ---------- i18n (same 8 languages and detection as the Seliq website) ---------- */
  const I18N = {
    en: {
      title: "Seliq Extensions", metaDesc: "Extension store for Seliq — hundreds of PopClip-compatible extensions, one click away.",
      site: "Seliq website", modeToggle: "Toggle dark mode", langLabel: "Language",
      heroTitle: "Find your next favorite.", heroSub: "{n} extensions for Seliq — PopClip-compatible, free and one click away.",
      searchPh: "Search by name, description or identifier", sort: "Sort", sortAsc: "Name A–Z", sortDesc: "Name Z–A", sortSize: "Smallest first",
      all: "All", results: "{n} results", none: "No extensions match your search.", download: "Download", copyLink: "Copy link", copied: "Copied",
      details: "Details", hide: "Hide", identifier: "Identifier", checksum: "SHA-256", source: "Source", category: "Category", license: "License", size: "Size", version: "Version",
      copy: "Copy", showMore: "Show more", showing: "Showing {a} of {b}", error: "Couldn’t load the catalog. Try again later, or open index.json directly.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip extensions are by Pilotmoon (Nicholas Moore) and contributors, taken unmodified from pilotmoon/PopClip-Extensions under the MIT License and provided for compatibility. Seliq is not affiliated with or endorsed by PopClip or Pilotmoon.",
      legalContrib: "PopClip Contrib: from the upstream contrib folder — user-contributed, experimental or niche extensions that may be outdated, provided as-is.",
    },
    ko: {
      title: "Seliq 확장", metaDesc: "Seliq 확장 스토어 — PopClip 호환 확장을 한 번의 클릭으로.",
      site: "Seliq 웹사이트", modeToggle: "다크 모드 전환", langLabel: "언어",
      heroTitle: "마음에 쏙 드는 확장을 찾아보세요.", heroSub: "Seliq용 확장 {n}개 — PopClip 호환, 무료, 클릭 한 번이면 끝.",
      searchPh: "이름·설명·식별자로 검색", sort: "정렬", sortAsc: "이름 가나다순", sortDesc: "이름 역순", sortSize: "작은 용량순",
      all: "전체", results: "결과 {n}개", none: "검색 결과가 없습니다.", download: "다운로드", copyLink: "링크 복사", copied: "복사됨",
      details: "자세히", hide: "접기", identifier: "식별자", checksum: "SHA-256", source: "출처", category: "카테고리", license: "라이선스", size: "용량", version: "버전",
      copy: "복사", showMore: "더 보기", showing: "{b}개 중 {a}개 표시", error: "카탈로그를 불러오지 못했습니다. 잠시 후 다시 시도하거나 index.json을 직접 열어 보세요.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip 확장은 Pilotmoon(Nicholas Moore)과 기여자들이 만든 것으로, pilotmoon/PopClip-Extensions에서 수정 없이 MIT 라이선스로 가져와 호환을 위해 제공합니다. Seliq은 PopClip 및 Pilotmoon과 제휴 관계가 아니며 보증을 받지 않았습니다.",
      legalContrib: "PopClip Contrib: 원본의 contrib 폴더에서 가져온 사용자 기여·실험·니치 확장으로, 오래되었을 수 있으며 있는 그대로 제공됩니다.",
    },
    ja: {
      title: "Seliq 拡張機能", metaDesc: "Seliq の拡張機能ストア — PopClip 互換の拡張機能をワンクリックで。",
      site: "Seliq サイト", modeToggle: "ダークモードを切り替え", langLabel: "言語",
      heroTitle: "お気に入りの拡張機能を見つけよう。", heroSub: "Seliq 用の拡張機能 {n} 個 — PopClip 互換、無料、ワンクリックで導入。",
      searchPh: "名前・説明・識別子で検索", sort: "並べ替え", sortAsc: "名前順（昇順）", sortDesc: "名前順（降順）", sortSize: "サイズの小さい順",
      all: "すべて", results: "{n} 件", none: "該当する拡張機能がありません。", download: "ダウンロード", copyLink: "リンクをコピー", copied: "コピーしました",
      details: "詳細", hide: "閉じる", identifier: "識別子", checksum: "SHA-256", source: "提供元", category: "カテゴリ", license: "ライセンス", size: "サイズ", version: "バージョン",
      copy: "コピー", showMore: "もっと見る", showing: "{b} 件中 {a} 件を表示", error: "カタログを読み込めませんでした。しばらくしてからもう一度お試しいただくか、index.json を直接開いてください。",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip 拡張機能は Pilotmoon（Nicholas Moore）と貢献者による作品で、pilotmoon/PopClip-Extensions から MIT ライセンスのもと無改変で取り込み、互換性のために提供しています。Seliq は PopClip／Pilotmoon と提携しておらず、承認も受けていません。",
      legalContrib: "PopClip Contrib: 元リポジトリの contrib フォルダ由来で、ユーザー提供・実験的・ニッチな拡張機能です。内容が古い場合があり、現状のまま提供されます。",
    },
    "zh-Hans": {
      title: "Seliq 扩展", metaDesc: "Seliq 扩展商店 — 一键获取与 PopClip 兼容的扩展。",
      site: "Seliq 官网", modeToggle: "切换深色模式", langLabel: "语言",
      heroTitle: "找到你的心仪扩展。", heroSub: "Seliq 扩展共 {n} 个 — 兼容 PopClip，免费，一键安装。",
      searchPh: "按名称、描述或标识符搜索", sort: "排序", sortAsc: "名称 A–Z", sortDesc: "名称 Z–A", sortSize: "体积从小到大",
      all: "全部", results: "{n} 个结果", none: "没有符合搜索条件的扩展。", download: "下载", copyLink: "复制链接", copied: "已复制",
      details: "详情", hide: "收起", identifier: "标识符", checksum: "SHA-256", source: "来源", category: "分类", license: "许可证", size: "大小", version: "版本",
      copy: "复制", showMore: "显示更多", showing: "显示 {a} / {b}", error: "无法加载目录。请稍后重试，或直接打开 index.json。",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip 扩展由 Pilotmoon（Nicholas Moore）及贡献者创作，依据 MIT 许可证原样取自 pilotmoon/PopClip-Extensions，仅为兼容而提供。Seliq 与 PopClip 或 Pilotmoon 无关联，亦未获其认可。",
      legalContrib: "PopClip Contrib：来自上游 contrib 文件夹，为用户贡献、实验性或小众扩展，可能已过时，按现状提供。",
    },
    "zh-Hant": {
      title: "Seliq 擴充功能", metaDesc: "Seliq 擴充功能商店 — 一鍵取得與 PopClip 相容的擴充功能。",
      site: "Seliq 官網", modeToggle: "切換深色模式", langLabel: "語言",
      heroTitle: "找到你的心儀擴充功能。", heroSub: "Seliq 擴充功能共 {n} 個 — 相容 PopClip，免費，一鍵安裝。",
      searchPh: "依名稱、說明或識別碼搜尋", sort: "排序", sortAsc: "名稱 A–Z", sortDesc: "名稱 Z–A", sortSize: "大小由小到大",
      all: "全部", results: "{n} 個結果", none: "沒有符合搜尋條件的擴充功能。", download: "下載", copyLink: "拷貝連結", copied: "已拷貝",
      details: "詳細資訊", hide: "收合", identifier: "識別碼", checksum: "SHA-256", source: "來源", category: "分類", license: "授權", size: "大小", version: "版本",
      copy: "拷貝", showMore: "顯示更多", showing: "顯示 {a} / {b}", error: "無法載入目錄。請稍後再試，或直接開啟 index.json。",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip 擴充功能由 Pilotmoon（Nicholas Moore）及貢獻者創作，依 MIT 授權原樣取自 pilotmoon/PopClip-Extensions，僅為相容而提供。Seliq 與 PopClip 或 Pilotmoon 無關聯，亦未獲其認可。",
      legalContrib: "PopClip Contrib：來自上游 contrib 資料夾，為使用者貢獻、實驗性或小眾的擴充功能，可能已過時，依現狀提供。",
    },
    de: {
      title: "Seliq Erweiterungen", metaDesc: "Erweiterungs-Store für Seliq — PopClip-kompatible Erweiterungen mit einem Klick.",
      site: "Seliq-Website", modeToggle: "Dunkelmodus umschalten", langLabel: "Sprache",
      heroTitle: "Finde deine nächste Lieblings-Erweiterung.", heroSub: "{n} Erweiterungen für Seliq — PopClip-kompatibel, kostenlos und mit einem Klick installiert.",
      searchPh: "Nach Name, Beschreibung oder Kennung suchen", sort: "Sortieren", sortAsc: "Name A–Z", sortDesc: "Name Z–A", sortSize: "Kleinste zuerst",
      all: "Alle", results: "{n} Ergebnisse", none: "Keine passenden Erweiterungen gefunden.", download: "Laden", copyLink: "Link kopieren", copied: "Kopiert",
      details: "Details", hide: "Zuklappen", identifier: "Kennung", checksum: "SHA-256", source: "Quelle", category: "Kategorie", license: "Lizenz", size: "Größe", version: "Version",
      copy: "Kopieren", showMore: "Mehr anzeigen", showing: "{a} von {b} angezeigt", error: "Der Katalog konnte nicht geladen werden. Versuche es später erneut oder öffne index.json direkt.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip-Erweiterungen stammen von Pilotmoon (Nicholas Moore) und Mitwirkenden, sind unverändert aus pilotmoon/PopClip-Extensions unter der MIT-Lizenz übernommen und dienen der Kompatibilität. Seliq steht in keiner Verbindung zu PopClip oder Pilotmoon und wird von ihnen nicht unterstützt.",
      legalContrib: "PopClip Contrib: aus dem Upstream-Ordner contrib — von Nutzern beigesteuerte, experimentelle oder Nischen-Erweiterungen, die veraltet sein können; Bereitstellung im Ist-Zustand.",
    },
    fr: {
      title: "Extensions Seliq", metaDesc: "Boutique d’extensions pour Seliq — des extensions compatibles PopClip en un clic.",
      site: "Site Seliq", modeToggle: "Basculer le mode sombre", langLabel: "Langue",
      heroTitle: "Trouvez votre prochaine extension favorite.", heroSub: "{n} extensions pour Seliq — compatibles PopClip, gratuites et à un clic.",
      searchPh: "Rechercher par nom, description ou identifiant", sort: "Trier", sortAsc: "Nom A–Z", sortDesc: "Nom Z–A", sortSize: "Plus petites d’abord",
      all: "Toutes", results: "{n} résultats", none: "Aucune extension ne correspond à votre recherche.", download: "Télécharger", copyLink: "Copier le lien", copied: "Copié",
      details: "Détails", hide: "Réduire", identifier: "Identifiant", checksum: "SHA-256", source: "Source", category: "Catégorie", license: "Licence", size: "Taille", version: "Version",
      copy: "Copier", showMore: "Afficher plus", showing: "{a} sur {b} affichées", error: "Impossible de charger le catalogue. Réessayez plus tard ou ouvrez directement index.json.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "Les extensions PopClip sont l’œuvre de Pilotmoon (Nicholas Moore) et de contributeurs ; elles sont reprises sans modification de pilotmoon/PopClip-Extensions sous licence MIT et fournies à des fins de compatibilité. Seliq n’est ni affilié à PopClip ou Pilotmoon, ni approuvé par eux.",
      legalContrib: "PopClip Contrib : issues du dossier contrib du dépôt d’origine — extensions de la communauté, expérimentales ou de niche, possiblement obsolètes, fournies en l’état.",
    },
    es: {
      title: "Extensiones de Seliq", metaDesc: "Tienda de extensiones para Seliq — extensiones compatibles con PopClip con un clic.",
      site: "Sitio de Seliq", modeToggle: "Cambiar modo oscuro", langLabel: "Idioma",
      heroTitle: "Encuentra tu próxima extensión favorita.", heroSub: "{n} extensiones para Seliq — compatibles con PopClip, gratuitas y a un clic.",
      searchPh: "Buscar por nombre, descripción o identificador", sort: "Ordenar", sortAsc: "Nombre A–Z", sortDesc: "Nombre Z–A", sortSize: "Más pequeñas primero",
      all: "Todas", results: "{n} resultados", none: "Ninguna extensión coincide con tu búsqueda.", download: "Descargar", copyLink: "Copiar enlace", copied: "Copiado",
      details: "Detalles", hide: "Ocultar", identifier: "Identificador", checksum: "SHA-256", source: "Origen", category: "Categoría", license: "Licencia", size: "Tamaño", version: "Versión",
      copy: "Copiar", showMore: "Mostrar más", showing: "Mostrando {a} de {b}", error: "No se pudo cargar el catálogo. Inténtalo más tarde o abre index.json directamente.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "Las extensiones de PopClip son de Pilotmoon (Nicholas Moore) y colaboradores, tomadas sin modificar de pilotmoon/PopClip-Extensions bajo la licencia MIT y ofrecidas por compatibilidad. Seliq no está afiliado ni respaldado por PopClip ni Pilotmoon.",
      legalContrib: "PopClip Contrib: procede de la carpeta contrib del repositorio original — extensiones aportadas por usuarios, experimentales o de nicho, que pueden estar desactualizadas, ofrecidas tal cual.",
    },
  };
  // same detection as the Seliq website (assets/i18n.js)
  function detectLang() {
    for (const raw of navigator.languages?.length ? navigator.languages : [navigator.language || ""]) {
      const tag = raw.toLowerCase();
      if (tag.startsWith("zh")) return /hant|-tw|-hk|-mo/.test(tag) ? "zh-Hant" : "zh-Hans";
      const base = tag.split("-")[0];
      if (I18N[base]) return base;
    }
    return "en";
  }
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  let lang = store.get("seliq-lang");
  if (!I18N[lang]) lang = detectLang();
  const t = (k, vars) => {
    let v = I18N[lang][k] ?? I18N.en[k] ?? k;
    if (vars) for (const [a, b] of Object.entries(vars)) v = v.replaceAll(`{${a}}`, b);
    return v;
  };

  /* ---------- dark mode (same behaviour as the website) ---------- */
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  let mode = store.get("seliq-mode") || (prefersDark.matches ? "dark" : "light");
  const applyMode = () => { body.dataset.mode = mode; store.set("seliq-mode", mode); };
  $("#mode-toggle").addEventListener("click", () => { mode = mode === "dark" ? "light" : "dark"; applyMode(); });
  prefersDark.addEventListener?.("change", (e) => { if (!store.get("seliq-mode")) { mode = e.matches ? "dark" : "light"; applyMode(); } });
  applyMode();

  /* ---------- tiles (ActionTile): FNV-1a of the identifier -> 8-colour palette ---------- */
  const PALETTE = ["#f55c54", "#f79433", "#e6a814", "#4abd66", "#33b8bd", "#4085f5", "#8c66ed", "#eb5e9e"];
  function tileColor(id) {
    let h = 0xcbf29ce484222325n;
    for (const b of new TextEncoder().encode(id)) { h ^= BigInt(b); h = (h * 0x100000001b3n) & 0xffffffffffffffffn; }
    return PALETTE[Number(h % 8n)];
  }
  // icon spec ("square filled 2d", "symbol:…", "iconify:set:name", plain text…) -> short tile text
  function tileText(ext) {
    const spec = (ext.icon || "").trim();
    let text = "";
    if (spec && !/^(symbol|iconify|file):/i.test(spec)) {
      text = spec.replace(/^text:/i, "").split(/\s+/)
        .filter((w) => !/^(square|circle|filled|monospaced|scale=.*|search|strike|flip|move|rotate.*)$/i.test(w)).join(" ");
    }
    if (!text) {
      // symbols / iconify / empty: initials of the name
      const words = ext.name.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).filter(Boolean);
      text = words.length > 1 ? words[0][0] + words[1][0] : [...(words[0] || "?")].slice(0, 2).join("");
    }
    const chars = [...text];
    return chars.length > 3 ? chars.slice(0, 2).join("") : text;
  }

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const desc = (e) => e.descriptions?.[lang] || e.description || "";
  const fmtSize = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB` : `${(n / 1048576).toFixed(1)} MB`);
  const isContrib = (e) => e.category === "PopClip Contrib";
  const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : "#");
  function upstreamUrl(u) {
    // "owner/repo@sha:path" -> GitHub tree link
    const m = /^([\w.-]+\/[\w.-]+)@([0-9a-f]{7,40}):(.+)$/.exec(u || "");
    return m ? `https://github.com/${m[1]}/tree/${m[2]}/${m[3].split("/").map(encodeURIComponent).join("/")}` : (/^https?:\/\//.test(u || "") ? u : null);
  }

  /* ---------- state ---------- */
  const PAGE = 48;
  let all = [], iconFiles = {}, shown = PAGE, cat = "", pendingHash = "";
  const grid = $("#grid"), more = $("#more"), chipsEl = $("#chips"), countEl = $("#count");

  const hashCode = () => decodeURIComponent(location.hash.slice(1));

  function visibleList() {
    const q = $("#search").value.trim().toLowerCase();
    const sort = $("#sort").value;
    const target = hashCode();
    let list = all.filter((e) => !e.unlisted || e.shortcode === target);
    if (cat) list = list.filter((e) => (cat === "__seliq" ? e.origin !== "popclip" : e.category === cat));
    if (q) {
      const words = q.split(/\s+/);
      list = list.filter((e) => {
        const hay = `${e.name} ${e.shortcode} ${e.identifier || ""} ${e.description || ""} ${desc(e)}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      });
    }
    const cmp = (a, b) => a.name.localeCompare(b.name, lang) || a.shortcode.localeCompare(b.shortcode);
    list.sort(sort === "desc" ? (a, b) => cmp(b, a) : sort === "size" ? (a, b) => a.size - b.size || cmp(a, b) : cmp);
    return list;
  }

  function tileHtml(e) {
    const file = iconFiles[e.shortcode];
    const color = tileColor(e.identifier || e.shortcode);
    const txt = tileText(e);
    const size = [...txt].length <= 1 ? 26 : [...txt].length === 2 ? 20 : 15;
    const fallback = `<span style="font-size:${size}px">${esc(txt)}</span>`;
    if (file) return `<span class="tile file" style="--t:${color}"><img src="${esc(file)}" alt="" loading="lazy" onerror="this.parentNode.className='tile';this.outerHTML=this.dataset.fb" data-fb="${esc(fallback)}"></span>`;
    return `<span class="tile" style="--t:${color}" aria-hidden="true">${fallback}</span>`;
  }

  function cardHtml(e, i) {
    const up = upstreamUrl(e.upstream);
    const badge = isContrib(e) ? `<span class="badge contrib">${t("contribBadge")}</span>` : e.origin === "popclip" ? `<span class="badge">${t("popclipBadge")}</span>` : "";
    const copyBtn = (v) => `<button class="copy" type="button" data-copy="${esc(v)}">${t("copy")}</button>`;
    const row = (k, v, plain) => (v ? `<dt>${t(k)}</dt><dd${plain ? ' class="plain"' : ""}>${v}</dd>` : "");
    return `<article class="card" id="${esc(e.shortcode)}" data-sc="${esc(e.shortcode)}" style="animation-delay:${Math.min(i % PAGE * 14, 300)}ms">
      <div class="card-top" data-toggle>
        ${tileHtml(e)}
        <div class="card-main">
          <h2 class="card-name"><span>${esc(e.name)}</span>${badge}</h2>
          <p class="card-desc">${esc(desc(e))}</p>
        </div>
      </div>
      <div class="card-foot">
        <span class="facts">v${esc(e.version)} · ${fmtSize(e.size)} · ${esc(e.license)}</span>
        <button class="btn btn-ghost" type="button" data-link title="${esc(t("copyLink"))}" aria-label="${esc(t("copyLink"))}"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2.2-2.2a2.6 2.6 0 0 0-3.7-3.7L8 4.3"/><path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0L3.3 9a2.6 2.6 0 0 0 3.7 3.7L8 11.7"/></svg></button>
        <button class="btn btn-ghost" type="button" data-toggle>${t("details")}</button>
        <a class="btn btn-primary" href="${esc(safeUrl(e.download))}" download>${t("download")}</a>
      </div>
      <div class="detail"><dl>
        ${row("identifier", e.identifier ? `<span>${esc(e.identifier)}</span>${copyBtn(e.identifier)}` : "")}
        ${row("checksum", `<span>${esc(e.sha256)}</span>${copyBtn(e.sha256)}`)}
        ${row("category", esc(e.category || "—"), true)}
        ${row("version", esc(e.version), true)}
        ${row("source", up ? `<a href="${esc(up)}" target="_blank" rel="noopener">${esc(e.upstream)}</a>` : esc(e.upstream || ""), true)}
      </dl></div>
    </article>`;
  }

  function render() {
    const list = visibleList();
    const target = hashCode();
    const ti = list.findIndex((e) => e.shortcode === target);
    if (ti >= shown) shown = ti + 1;
    const slice = list.slice(0, shown);
    countEl.textContent = t("results", { n: list.length });
    if (!list.length) { grid.innerHTML = `<p class="empty">${esc(t("none"))}</p>`; more.innerHTML = ""; return; }
    grid.innerHTML = slice.map(cardHtml).join("");
    more.innerHTML = list.length > shown ? `${esc(t("showing", { a: slice.length, b: list.length }))}<br><br><button type="button" id="show-more">${esc(t("showMore"))}</button>` : "";
    $("#show-more")?.addEventListener("click", () => { shown += PAGE; render(); });
    if (pendingHash) { const h = pendingHash; pendingHash = ""; focusCard(h); }
  }

  function renderChips() {
    const counts = {};
    let seliq = 0;
    for (const e of all) { if (e.unlisted) continue; if (e.origin !== "popclip") seliq++; if (e.category) counts[e.category] = (counts[e.category] || 0) + 1; }
    const order = ["PopClip", "PopClip Contrib"];
    const cats = Object.keys(counts).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b));
    const chips = [["", t("all"), all.filter((e) => !e.unlisted).length]]
      .concat(seliq ? [["__seliq", "Seliq", seliq]] : [], cats.map((c) => [c, c, counts[c]]));
    chipsEl.innerHTML = chips.map(([v, label, n]) => `<button class="chip" type="button" role="tab" data-cat="${esc(v)}" aria-selected="${v === cat}">${esc(label)}<small>${n}</small></button>`).join("");
  }
  chipsEl.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-cat]");
    if (!b) return;
    cat = b.dataset.cat; shown = PAGE; renderChips(); render();
  });

  /* ---------- deep link: scroll to + highlight the card, expand its details ---------- */
  function focusCard(code) {
    const el = document.getElementById(code);
    if (!el || !el.classList.contains("card")) return;
    document.querySelectorAll(".card.hl").forEach((c) => c.classList.remove("hl"));
    el.classList.add("open");
    el.querySelector("button[data-toggle]").textContent = t("hide");
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.remove("hl"); void el.offsetWidth; el.classList.add("hl");
    setTimeout(() => el.classList.remove("hl"), 2600);
  }
  function onHash() {
    const code = hashCode();
    if (!code || !all.length) return;
    if (!document.getElementById(code)) { cat = ""; $("#search").value = ""; renderChips(); pendingHash = code; render(); }
    else focusCard(code);
  }
  window.addEventListener("hashchange", onHash);

  /* ---------- interactions ---------- */
  async function copyText(text, btn, label) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch { /* ignore */ } ta.remove();
    }
    const prev = btn.innerHTML; btn.textContent = t("copied");
    setTimeout(() => { btn.innerHTML = prev; }, 1200);
  }
  grid.addEventListener("click", (ev) => {
    const card = ev.target.closest(".card");
    if (!card) return;
    if (ev.target.closest("a")) return;
    const cp = ev.target.closest("[data-copy]");
    if (cp) { copyText(cp.dataset.copy, cp); return; }
    if (ev.target.closest("[data-link]")) {
      const btn = ev.target.closest("[data-link]");
      const url = location.href.split("#")[0] + "#" + card.dataset.sc;
      copyText(url, btn);
      return;
    }
    if (ev.target.closest("[data-toggle]")) {
      card.classList.toggle("open");
      card.querySelector("button[data-toggle]").textContent = card.classList.contains("open") ? t("hide") : t("details");
    }
  });

  let debounce = 0;
  $("#search").addEventListener("input", () => { clearTimeout(debounce); debounce = setTimeout(() => { shown = PAGE; render(); }, 120); });
  $("#sort").addEventListener("change", () => { shown = PAGE; render(); });

  /* ---------- language ---------- */
  function applyLang() {
    document.documentElement.lang = lang;
    body.dataset.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.title = t("title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = t("metaDesc");
    $("#lang-select").value = lang;
    $("#lang-select").setAttribute("aria-label", t("langLabel"));
    $("#mode-toggle").setAttribute("aria-label", t("modeToggle"));
    $("#site-link").title = t("site");
    $("#legal-popclip").textContent = t("legalPopclip");
    $("#legal-contrib").textContent = t("legalContrib");
    if (all.length) {
      $("#hero-sub").textContent = t("heroSub", { n: all.filter((e) => !e.unlisted).length });
      renderChips(); render();
    }
  }
  $("#lang-select").addEventListener("change", (e) => { lang = e.target.value; store.set("seliq-lang", lang); applyLang(); });

  /* ---------- load ---------- */
  applyLang();
  Promise.all([
    fetch("./index.json").then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    fetch("./icon-files.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
  ]).then(([data, icons]) => {
    all = data.extensions || data;
    iconFiles = icons || {};
    pendingHash = hashCode();
    applyLang();
  }).catch(() => {
    grid.innerHTML = `<p class="error">${esc(t("error"))}</p>`;
  });
})();
