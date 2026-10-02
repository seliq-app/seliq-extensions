/* Seliq Extensions — store page logic: i18n, theme, live catalog from index.json */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- i18n ---------- */
  const LANGS = ["en", "ko", "ja", "zh-Hans", "zh-Hant", "de", "fr", "es"];
  const I18N = {
    en: {
      brandSuffix: "Extensions", navCatalog: "Catalog", navGetSeliq: "Get Seliq",
      kicker: "Extension store for Seliq · PopClip-compatible",
      heroTitle: "Select text.<br>The rest is instant.",
      heroSub: "Hundreds of one-click actions for the Seliq action bar on Mac — search, translate, notes, calculators and more. Download any extension and drop it into Seliq.",
      statExts: "extensions", statLangs: "languages", statLicense: "licensed",
      searchPh: (n) => `Search ${n} extensions…`,
      all: "All", count: (n) => `${n} extension${n === 1 ? "" : "s"}`,
      download: "Get", showing: (a, b) => `Showing ${a} of ${b}`, showMore: "Show more",
      noResults: (q) => `No extensions match “${q}”.`,
      err: "Couldn't load the catalog. ", errLink: "Open index.json directly",
      devTitle: "Machine-readable",
      devBody: `Apps consume this store as JSON: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a> (schema 1) lists every extension with its <code>download</code> URL and <code>sha256</code>. Verified, zipped, and served from GitHub Pages.`,
    },
    ko: {
      brandSuffix: "확장", navCatalog: "목록", navGetSeliq: "Seliq 받기",
      kicker: "Seliq 확장 스토어 · PopClip 호환",
      heroTitle: "텍스트를 선택하세요.<br>나머지는 순식간에.",
      heroSub: "Mac용 Seliq 액션 바를 위한 수백 가지 원클릭 액션 — 검색, 번역, 노트, 계산기 등. 확장을 날라받아 Seliq에 넣기만 하면 됩니다.",
      statExts: "확장", statLangs: "언어", statLicense: "라이선스",
      searchPh: (n) => `확장 ${n}개 검색…`,
      all: "전체", count: (n) => `확장 ${n}개`,
      download: "받기", showing: (a, b) => `${b}개 중 ${a}개 표시`, showMore: "더 보기",
      noResults: (q) => `“${q}”에 맞는 확장이 없습니다.`,
      err: "목록을 불러오지 못했습니다. ", errLink: "index.json 직접 열기",
      devTitle: "기계 판독용",
      devBody: `앱은 이 스토어를 JSON으로 읽습니다: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a>(schema 1)에 모든 확장의 <code>download</code> URL과 <code>sha256</code>이 들어 있습니다. 검증 후 zip으로 묶어 GitHub Pages에서 제공합니다.`,
    },
    ja: {
      brandSuffix: "拡張機能", navCatalog: "カタログ", navGetSeliq: "Seliqを入手",
      kicker: "Seliq拡張機能ストア · PopClip互換",
      heroTitle: "テキストを選択。<br>あとは一瞬で。",
      heroSub: "Mac向けSeliqアクションバーのための数百のワンクリックアクション — 検索、翻訳、メモ、計算機など。拡張機能をダウンロードしてSeliqに入れるだけです。",
      statExts: "拡張機能", statLangs: "言語", statLicense: "ライセンス",
      searchPh: (n) => `${n}個の拡張機能を検索…`,
      all: "すべて", count: (n) => `${n}件の拡張機能`,
      download: "入手", showing: (a, b) => `${b}件中${a}件を表示`, showMore: "もっと見る",
      noResults: (q) => `「${q}」に一致する拡張機能はありません。`,
      err: "カタログを読み込めませんでした。", errLink: "index.jsonを直接開く",
      devTitle: "機械可読",
      devBody: `アプリはこのストアをJSONとして読み取ります: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a>(schema 1)にはすべての拡張機能の<code>download</code> URLと<code>sha256</code>が含まれます。検証・zip化され、GitHub Pagesから配信されます。`,
    },
    "zh-Hans": {
      brandSuffix: "扩展", navCatalog: "目录", navGetSeliq: "获取 Seliq",
      kicker: "Seliq 扩展商店 · 兼容 PopClip",
      heroTitle: "选中文本。<br>剩下的一瞬完成。",
      heroSub: "为 Mac 上的 Seliq 操作栏提供数百个一键操作——搜索、翻译、笔记、计算器等。下载扩展并放入 Seliq 即可。",
      statExts: "扩展", statLangs: "语言", statLicense: "许可证",
      searchPh: (n) => `搜索 ${n} 个扩展…`,
      all: "全部", count: (n) => `${n} 个扩展`,
      download: "获取", showing: (a, b) => `显示 ${b} 个中的 ${a} 个`, showMore: "显示更多",
      noResults: (q) => `没有匹配“${q}”的扩展。`,
      err: "无法加载目录。", errLink: "直接打开 index.json",
      devTitle: "机器可读",
      devBody: `应用以 JSON 读取此商店: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a>(schema 1)列出每个扩展的 <code>download</code> URL 和 <code>sha256</code>。经校验打包后由 GitHub Pages 提供。`,
    },
    "zh-Hant": {
      brandSuffix: "擴充功能", navCatalog: "目錄", navGetSeliq: "取得 Seliq",
      kicker: "Seliq 擴充功能商店 · 相容 PopClip",
      heroTitle: "選取文字。<br>剩下的瞬間完成。",
      heroSub: "為 Mac 上的 Seliq 動作列提供數百個一鍵操作——搜尋、翻譯、筆記、計算機等。下載擴充功能並放入 Seliq 即可。",
      statExts: "擴充功能", statLangs: "語言", statLicense: "授權",
      searchPh: (n) => `搜尋 ${n} 個擴充功能…`,
      all: "全部", count: (n) => `${n} 個擴充功能`,
      download: "取得", showing: (a, b) => `顯示 ${b} 個中的 ${a} 個`, showMore: "顯示更多",
      noResults: (q) => `沒有符合「${q}」的擴充功能。`,
      err: "無法載入目錄。", errLink: "直接開啟 index.json",
      devTitle: "機器可讀",
      devBody: `應用以 JSON 讀取此商店: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a>(schema 1)列出每個擴充功能的 <code>download</code> URL 與 <code>sha256</code>。經驗證打包後由 GitHub Pages 提供。`,
    },
    de: {
      brandSuffix: "Erweiterungen", navCatalog: "Katalog", navGetSeliq: "Seliq laden",
      kicker: "Erweiterungs-Store für Seliq · PopClip-kompatibel",
      heroTitle: "Text auswählen.<br>Der Rest passiert sofort.",
      heroSub: "Hunderte Ein-Klick-Aktionen für die Seliq-Aktionsleiste auf dem Mac — Suche, Übersetzung, Notizen, Rechner und mehr. Erweiterung laden und in Seliq ablegen.",
      statExts: "Erweiterungen", statLangs: "Sprachen", statLicense: "lizenziert",
      searchPh: (n) => `${n} Erweiterungen durchsuchen…`,
      all: "Alle", count: (n) => `${n} Erweiterung${n === 1 ? "" : "en"}`,
      download: "Laden", showing: (a, b) => `${a} von ${b} angezeigt`, showMore: "Mehr anzeigen",
      noResults: (q) => `Keine Erweiterungen für „${q}“.`,
      err: "Katalog konnte nicht geladen werden. ", errLink: "index.json direkt öffnen",
      devTitle: "Maschinenlesbar",
      devBody: `Apps lesen diesen Store als JSON: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a> (Schema 1) listet jede Erweiterung mit <code>download</code>-URL und <code>sha256</code>. Verifiziert, gezippt und über GitHub Pages bereitgestellt.`,
    },
    fr: {
      brandSuffix: "Extensions", navCatalog: "Catalogue", navGetSeliq: "Obtenir Seliq",
      kicker: "Boutique d'extensions pour Seliq · Compatible PopClip",
      heroTitle: "Sélectionnez du texte.<br>Le reste est instantané.",
      heroSub: "Des centaines d'actions en un clic pour la barre d'actions Seliq sur Mac — recherche, traduction, notes, calculatrices et plus. Téléchargez une extension et déposez-la dans Seliq.",
      statExts: "extensions", statLangs: "langues", statLicense: "sous licence",
      searchPh: (n) => `Rechercher parmi ${n} extensions…`,
      all: "Tout", count: (n) => `${n} extension${n === 1 ? "" : "s"}`,
      download: "Obtenir", showing: (a, b) => `${a} sur ${b} affichées`, showMore: "Afficher plus",
      noResults: (q) => `Aucune extension ne correspond à « ${q} ».`,
      err: "Impossible de charger le catalogue. ", errLink: "Ouvrir index.json directement",
      devTitle: "Lisible par machine",
      devBody: `Les apps lisent cette boutique en JSON : <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a> (schéma 1) liste chaque extension avec son URL <code>download</code> et son <code>sha256</code>. Vérifié, compressé et servi via GitHub Pages.`,
    },
    es: {
      brandSuffix: "Extensiones", navCatalog: "Catálogo", navGetSeliq: "Obtener Seliq",
      kicker: "Tienda de extensiones para Seliq · Compatible con PopClip",
      heroTitle: "Selecciona texto.<br>El resto es instantáneo.",
      heroSub: "Cientos de acciones de un clic para la barra de acciones Seliq en Mac — búsqueda, traducción, notas, calculadoras y más. Descarga una extensión y suéltala en Seliq.",
      statExts: "extensiones", statLangs: "idiomas", statLicense: "con licencia",
      searchPh: (n) => `Buscar entre ${n} extensiones…`,
      all: "Todas", count: (n) => `${n} extensi${n === 1 ? "ón" : "ones"}`,
      download: "Obtener", showing: (a, b) => `Mostrando ${a} de ${b}`, showMore: "Mostrar más",
      noResults: (q) => `Ninguna extensión coincide con «${q}».`,
      err: "No se pudo cargar el catálogo. ", errLink: "Abrir index.json directamente",
      devTitle: "Legible por máquina",
      devBody: `Las apps leen esta tienda como JSON: <a href="index.json" target="_blank" rel="noopener"><code>index.json</code></a> (esquema 1) lista cada extensión con su URL de <code>download</code> y su <code>sha256</code>. Verificado, comprimido y servido desde GitHub Pages.`,
    },
  };

  function detectLang() {
    const saved = localStorage.getItem("seliq-ext-lang");
    if (saved && LANGS.includes(saved)) return saved;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    const n = nav.toLowerCase();
    if (n.startsWith("zh")) return /tw|hk|mo|hant/.test(n) ? "zh-Hant" : "zh-Hans";
    const base = n.split("-")[0];
    return LANGS.includes(base) ? base : "en";
  }

  let lang = detectLang();
  const t = (k) => I18N[lang][k] ?? I18N.en[k];

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const v = t(el.dataset.i18nPh);
      el.placeholder = typeof v === "function" ? v(totalCount) : v;
    });
  }

  /* ---------- theme ---------- */
  const rootEl = document.documentElement;
  const savedMode = localStorage.getItem("seliq-ext-theme");
  rootEl.dataset.mode = savedMode || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  $("#mode-toggle").addEventListener("click", () => {
    rootEl.dataset.mode = rootEl.dataset.mode === "dark" ? "light" : "dark";
    localStorage.setItem("seliq-ext-theme", rootEl.dataset.mode);
  });

  /* ---------- catalog ---------- */
  const grid = $("#ext-grid");
  const searchInput = $("#ext-search");
  const chipsEl = $("#cat-chips");
  const countEl = $("#ext-count");
  const moreEl = $("#ext-more");
  const PAGE = 48;
  let exts = [];
  let totalCount = 0;
  let shown = PAGE;
  let activeCat = "";
  let searchTimer = 0;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // PopClip text icon spec: "[square|circle] [filled] <text>", "monospaced ...", "symbol:...", "iconify:..."
  function tileFor(ext) {
    const ic = (ext.icon || "").trim();
    let text = null, outline = false;
    let m = ic.match(/^(square|circle)\s+(filled\s+)?(.+)$/i);
    if (m) { text = m[3]; outline = !m[2]; }
    else if ((m = ic.match(/^monospaced\s+(.+)$/i))) text = m[1];
    else if (ic && !/^(symbol|iconify|file):/i.test(ic)) text = ic;
    if (!text) text = (ext.name || "?").replace(/[^A-Za-z0-9가-힣]/g, "").slice(0, 2) || "?";
    text = text.slice(0, 3);
    // deterministic hue from shortcode
    let h = 0;
    for (const ch of ext.shortcode || ext.name || "?") h = (h * 31 + ch.charCodeAt(0)) % 360;
    const dark = rootEl.dataset.mode === "dark";
    const bg = `background:linear-gradient(135deg,hsl(${h} 72% ${dark ? 52 : 58}%),hsl(${(h + 40) % 360} 78% ${dark ? 42 : 48}%));`;
    const fg = outline ? `color:hsl(${h} 65% ${dark ? 70 : 45}%);` : "";
    return `<span class="tile${outline ? " outline" : ""}" style="${bg}${fg}">${esc(text)}</span>`;
  }

  const descOf = (e) => (e.descriptions && e.descriptions[lang]) || e.description || "";

  function matches(e, q) {
    if (activeCat && e.category !== activeCat) return false;
    if (e.unlisted) return false;
    if (!q) return true;
    const hay = `${e.name} ${e.description || ""} ${descOf(e)}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }

  const fmtSize = (b) => (b == null ? "" : b < 1024 ? `${b} B` : `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB`);

  function cardHtml(e, i) {
    const contrib = e.category === "PopClip Contrib";
    const badge = contrib ? `<span class="badge badge-contrib">Contrib</span>`
      : e.origin === "popclip" ? `<span class="badge badge-popclip">PopClip</span>` : "";
    const meta = [`v${esc(e.version)}`, fmtSize(e.size), esc(e.license)].filter(Boolean).join(` <span class="dot">·</span> `);
    return `<article class="card" id="ext-${esc(e.shortcode)}" data-shortcode="${esc(e.shortcode)}" style="animation-delay:${Math.min(i * 14, 350)}ms">
      ${tileFor(e)}
      <div class="card-body">
        <div class="card-top"><h3>${esc(e.name)}</h3>${badge}</div>
        <p class="desc">${esc(descOf(e))}</p>
        <div class="meta">${meta}
          <a class="dl" href="${esc(e.download)}" title="${esc(e.name)} .popclipextz">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v8M4.5 7L8 10.5L11.5 7M3 13.5h10"/></svg>
            ${esc(t("download"))}</a>
        </div>
      </div>
    </article>`;
  }

  function render() {
    const q = searchInput.value.trim();
    const hits = exts.filter((e) => matches(e, q));
    const slice = hits.slice(0, shown);
    countEl.textContent = q || activeCat ? t("count")(hits.length) : "";
    if (!slice.length) {
      grid.innerHTML = `<p class="ext-error">${esc(t("noResults")(q))}</p>`;
      moreEl.innerHTML = "";
      return;
    }
    grid.innerHTML = slice.map(cardHtml).join("");
    moreEl.innerHTML = hits.length > shown
      ? `${t("showing")(slice.length, hits.length)} — <a href="#" id="ext-show-more">${t("showMore")}</a>`
      : (q || activeCat) ? t("showing")(slice.length, hits.length) : "";
    const moreBtn = $("#ext-show-more");
    if (moreBtn) moreBtn.addEventListener("click", (ev) => { ev.preventDefault(); shown += PAGE; render(); });
  }

  function buildChips() {
    const cats = [...new Set(exts.filter((e) => !e.unlisted).map((e) => e.category).filter(Boolean))].sort();
    const countFor = (c) => exts.filter((e) => !e.unlisted && (!c || e.category === c)).length;
    const mk = (val, label, n) => `<button class="chip${val === activeCat ? " active" : ""}" data-cat="${esc(val)}" role="tab">${esc(label)}<span class="n">${n}</span></button>`;
    chipsEl.innerHTML = mk("", t("all"), countFor("")) + cats.map((c) => mk(c, c, countFor(c))).join("");
    chipsEl.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      activeCat = b.dataset.cat; shown = PAGE;
      chipsEl.querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === b));
      render();
    }));
  }

  function focusHash() {
    const sc = location.hash.slice(1);
    if (!sc) return false;
    const idx = exts.findIndex((e) => e.shortcode === sc && !e.unlisted);
    if (idx < 0) return false;
    // make sure the target is inside the current filter/search and page window
    if (activeCat || searchInput.value.trim()) {
      activeCat = "";
      searchInput.value = "";
      buildChips();
    }
    const hits = exts.filter((e) => matches(e, ""));
    const pos = hits.findIndex((e) => e.shortcode === sc);
    if (pos >= shown) shown = Math.ceil((pos + 1) / PAGE) * PAGE;
    render();
    const el = document.getElementById(`ext-${CSS.escape(sc)}`);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    return true;
  }

  function loadCatalog() {
    fetch("index.json")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        exts = (data.extensions || data).slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        totalCount = exts.filter((e) => !e.unlisted).length;
        $("#hero-stats").hidden = false;
        $("#stat-count").textContent = totalCount;
        applyI18n();
        buildChips();
        render();
        focusHash();
      })
      .catch(() => {
        countEl.textContent = "";
        grid.innerHTML = `<p class="ext-error">${esc(t("err"))}<a href="index.json">${esc(t("errLink"))}</a></p>`;
      });
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { shown = PAGE; render(); }, 120);
  });
  window.addEventListener("hashchange", () => { if (exts.length) focusHash(); });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "/" && document.activeElement !== searchInput && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      ev.preventDefault(); searchInput.focus();
    }
  });

  $("#lang-select").value = lang;
  $("#lang-select").addEventListener("change", (ev) => {
    lang = ev.target.value;
    localStorage.setItem("seliq-ext-lang", lang);
    applyI18n();
    buildChips();
    render();
  });

  applyI18n();
  loadCatalog();
})();
