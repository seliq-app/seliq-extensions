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
      install: "Install in Seliq", dismiss: "Dismiss",
      pendingTab: "Pending review", pendingBadge: "In review", pendingSubmitted: "Submitted {date}",
      pendingNote: "Extensions shared by Seliq users, waiting for review. They can’t be installed until they are approved and published.", pendingNone: "No extensions are waiting for review right now.",
      hint: "Install button does nothing? Update Seliq, or use Download and open the file with Seliq (Finder › Get Info › Open with › Seliq › Change All). If PopClip is installed, double-clicking a downloaded file opens PopClip.",
    },
    ko: {
      title: "Seliq 확장", metaDesc: "Seliq 확장 스토어 — PopClip 호환 확장을 한 번의 클릭으로.",
      site: "Seliq 웹사이트", modeToggle: "다크 모드 전환", langLabel: "언어",
      heroTitle: "마음에 쏙 드는 확장을 찾아보세요.", heroSub: "Seliq용 확장 {n}개 — PopClip 호환, 무료, 클릭 한 번이면 끝.",
      searchPh: "이름·설명·식별자로 검색", sort: "정렬", sortAsc: "이름 가나다순", sortDesc: "이름 역순", sortSize: "작은 용량순",
      all: "전체", results: "결과 {n}개", none: "검색 결과가 없습니다.", download: "다운로드", copyLink: "링크 복사", copied: "복사됨",
      details: "자세히", hide: "접기", intents: "이럴 때 써요", identifier: "식별자", checksum: "SHA-256", source: "출처", category: "카테고리", license: "라이선스", size: "용량", version: "버전",
      copy: "복사", showMore: "더 보기", showing: "{b}개 중 {a}개 표시", error: "카탈로그를 불러오지 못했습니다. 잠시 후 다시 시도하거나 index.json을 직접 열어 보세요.",
      contribBadge: "Contrib", popclipBadge: "PopClip",
      legalPopclip: "PopClip 확장은 Pilotmoon(Nicholas Moore)과 기여자들이 만든 것으로, pilotmoon/PopClip-Extensions에서 수정 없이 MIT 라이선스로 가져와 호환을 위해 제공합니다. Seliq은 PopClip 및 Pilotmoon과 제휴 관계가 아니며 보증을 받지 않았습니다.",
      legalContrib: "PopClip Contrib: 원본의 contrib 폴더에서 가져온 사용자 기여·실험·니치 확장으로, 오래되었을 수 있으며 있는 그대로 제공됩니다.",
      install: "Seliq에서 설치", dismiss: "닫기",
      pendingTab: "검토 대기", pendingBadge: "검토 중", pendingSubmitted: "{date} 제출",
      pendingNote: "Seliq 사용자가 공유한 확장으로, 검토를 기다리고 있습니다. 승인되어 스토어에 올라오기 전에는 설치할 수 없습니다.", pendingNone: "지금 검토를 기다리는 확장이 없습니다.",
      hint: "설치 버튼이 반응하지 않으면 Seliq을 최신 버전으로 업데이트하거나, 다운로드한 파일을 Seliq으로 여세요(Finder › 정보 가져오기 › 다음으로 열기 › Seliq › 모두 변경). PopClip이 설치되어 있으면 다운로드한 파일을 더블클릭할 때 PopClip이 열립니다.",
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
      install: "Seliq にインストール", dismiss: "閉じる",
      pendingTab: "審査待ち", pendingBadge: "審査中", pendingSubmitted: "{date} に提出",
      pendingNote: "Seliq ユーザーが共有した拡張機能で、審査を待っています。承認されてストアに公開されるまではインストールできません。", pendingNone: "現在、審査待ちの拡張機能はありません。",
      hint: "インストールボタンが反応しない場合は、Seliq を最新版にアップデートするか、ダウンロードしたファイルを Seliq で開いてください（Finder › 情報を見る › このアプリケーションで開く › Seliq › すべてを変更）。PopClip がインストールされていると、ダウンロードしたファイルをダブルクリックしたときに PopClip が開きます。",
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
      install: "在 Seliq 中安装", dismiss: "关闭",
      pendingTab: "待审核", pendingBadge: "审核中", pendingSubmitted: "提交于 {date}",
      pendingNote: "Seliq 用户分享的扩展，正在等待审核。在获批并发布到商店之前无法安装。", pendingNone: "目前没有等待审核的扩展。",
      hint: "如果安装按钮没有反应，请更新 Seliq，或点击“下载”后用 Seliq 打开该文件（访达 › 显示简介 › 打开方式 › Seliq › 全部更改）。若已安装 PopClip，双击下载的文件会由 PopClip 打开。",
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
      install: "在 Seliq 中安裝", dismiss: "關閉",
      pendingTab: "待審核", pendingBadge: "審核中", pendingSubmitted: "提交於 {date}",
      pendingNote: "Seliq 使用者分享的擴充功能，正在等待審核。在核准並發布到商店之前無法安裝。", pendingNone: "目前沒有等待審核的擴充功能。",
      hint: "若安裝按鈕沒有反應，請更新 Seliq，或點按「下載」後用 Seliq 打開該檔案（Finder › 取得資訊 › 打開方式 › Seliq › 全部更改）。若已安裝 PopClip，連按兩下下載的檔案會由 PopClip 開啟。",
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
      install: "In Seliq installieren", dismiss: "Schließen",
      pendingTab: "In Prüfung", pendingBadge: "Wird geprüft", pendingSubmitted: "Eingereicht am {date}",
      pendingNote: "Von Seliq-Nutzern geteilte Erweiterungen, die auf ihre Prüfung warten. Sie lassen sich erst installieren, wenn sie freigegeben und veröffentlicht sind.", pendingNone: "Zurzeit warten keine Erweiterungen auf eine Prüfung.",
      hint: "Reagiert die Installieren-Taste nicht? Aktualisiere Seliq oder nutze „Laden“ und öffne die Datei mit Seliq (Finder › Informationen › Öffnen mit › Seliq › Alle ändern). Ist PopClip installiert, öffnet ein Doppelklick auf die geladene Datei PopClip.",
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
      install: "Installer dans Seliq", dismiss: "Fermer",
      pendingTab: "En attente d’examen", pendingBadge: "En cours d’examen", pendingSubmitted: "Soumise le {date}",
      pendingNote: "Extensions partagées par des utilisateurs de Seliq, en attente d’examen. Elles ne peuvent pas être installées avant d’avoir été approuvées et publiées.", pendingNone: "Aucune extension n’est en attente d’examen pour le moment.",
      hint: "Le bouton d’installation ne réagit pas ? Mettez Seliq à jour, ou utilisez Télécharger et ouvrez le fichier avec Seliq (Finder › Lire les informations › Ouvrir avec › Seliq › Tout modifier). Si PopClip est installé, un double-clic sur le fichier téléchargé ouvre PopClip.",
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
      install: "Instalar en Seliq", dismiss: "Cerrar",
      pendingTab: "Pendientes de revisión", pendingBadge: "En revisión", pendingSubmitted: "Enviada el {date}",
      pendingNote: "Extensiones compartidas por usuarios de Seliq que esperan revisión. No se pueden instalar hasta que se aprueben y publiquen.", pendingNone: "Ahora mismo no hay extensiones esperando revisión.",
      hint: "¿El botón de instalar no hace nada? Actualiza Seliq o usa Descargar y abre el archivo con Seliq (Finder › Obtener información › Abrir con › Seliq › Cambiar todo). Si PopClip está instalado, al hacer doble clic en el archivo descargado se abre PopClip.",
    },
    it: {
      title: "Estensioni Seliq",
      metaDesc: "Store di estensioni per Seliq — estensioni compatibili con PopClip a portata di clic.",
      site: "Sito di Seliq",
      modeToggle: "Attiva/disattiva modalità scura",
      langLabel: "Lingua",
      heroTitle: "Trova la tua prossima preferita.",
      heroSub: "{n} estensioni per Seliq — compatibili con PopClip, gratuite e a un clic di distanza.",
      searchPh: "Cerca per nome, descrizione o identificatore",
      sort: "Ordina",
      sortAsc: "Nome A–Z",
      sortDesc: "Nome Z–A",
      sortSize: "Prima le più piccole",
      all: "Tutte",
      results: "{n} risultati",
      none: "Nessuna estensione corrisponde alla ricerca.",
      download: "Scarica",
      copyLink: "Copia link",
      copied: "Copiato",
      details: "Dettagli",
      hide: "Nascondi",
      identifier: "Identificatore",
      checksum: "SHA-256",
      source: "Origine",
      category: "Categoria",
      license: "Licenza",
      size: "Dimensione",
      version: "Versione",
      copy: "Copia",
      showMore: "Mostra altro",
      showing: "Mostrate {a} di {b}",
      error: "Impossibile caricare il catalogo. Riprova più tardi o apri direttamente index.json.",
      contribBadge: "Contrib",
      popclipBadge: "PopClip",
      legalPopclip: "Le estensioni PopClip sono di Pilotmoon (Nicholas Moore) e dei collaboratori, riprese senza modifiche da pilotmoon/PopClip-Extensions con licenza MIT e fornite per compatibilità. Seliq non è affiliato né approvato da PopClip o Pilotmoon.",
      legalContrib: "PopClip Contrib: dalla cartella contrib del repository originale — estensioni create dagli utenti, sperimentali o di nicchia che potrebbero essere obsolete, fornite così come sono.",
      install: "Installa in Seliq",
      dismiss: "Chiudi",
      pendingTab: "In attesa di revisione", pendingBadge: "In revisione", pendingSubmitted: "Inviata il {date}",
      pendingNote: "Estensioni condivise dagli utenti di Seliq, in attesa di revisione. Non si possono installare finché non vengono approvate e pubblicate.", pendingNone: "Al momento nessuna estensione è in attesa di revisione.",
      hint: "Il pulsante di installazione non fa nulla? Aggiorna Seliq, oppure usa Scarica e apri il file con Seliq (Finder › Ottieni informazioni › Apri con › Seliq › Cambia tutto). Se PopClip è installato, facendo doppio clic su un file scaricato si apre PopClip.",
    },
    "pt-BR": {
      title: "Extensões do Seliq",
      metaDesc: "Loja de extensões do Seliq — extensões compatíveis com o PopClip a um clique.",
      site: "Site do Seliq",
      modeToggle: "Alternar modo escuro",
      langLabel: "Idioma",
      heroTitle: "Encontre sua próxima favorita.",
      heroSub: "{n} extensões para o Seliq — compatíveis com o PopClip, gratuitas e a um clique.",
      searchPh: "Buscar por nome, descrição ou identificador",
      sort: "Ordenar",
      sortAsc: "Nome A–Z",
      sortDesc: "Nome Z–A",
      sortSize: "Menores primeiro",
      all: "Todas",
      results: "{n} resultados",
      none: "Nenhuma extensão corresponde à sua busca.",
      download: "Baixar",
      copyLink: "Copiar link",
      copied: "Copiado",
      details: "Detalhes",
      hide: "Recolher",
      identifier: "Identificador",
      checksum: "SHA-256",
      source: "Origem",
      category: "Categoria",
      license: "Licença",
      size: "Tamanho",
      version: "Versão",
      copy: "Copiar",
      showMore: "Mostrar mais",
      showing: "Mostrando {a} de {b}",
      error: "Não foi possível carregar o catálogo. Tente novamente mais tarde ou abra o index.json diretamente.",
      contribBadge: "Contrib",
      popclipBadge: "PopClip",
      legalPopclip: "As extensões do PopClip são de Pilotmoon (Nicholas Moore) e colaboradores, obtidas sem modificações de pilotmoon/PopClip-Extensions sob a licença MIT e oferecidas por compatibilidade. O Seliq não é afiliado nem endossado pelo PopClip ou pela Pilotmoon.",
      legalContrib: "PopClip Contrib: da pasta contrib do repositório original — extensões enviadas por usuários, experimentais ou de nicho, que podem estar desatualizadas, oferecidas no estado em que se encontram.",
      install: "Instalar no Seliq",
      dismiss: "Fechar",
      pendingTab: "Aguardando análise", pendingBadge: "Em análise", pendingSubmitted: "Enviada em {date}",
      pendingNote: "Extensões compartilhadas por usuários do Seliq, aguardando análise. Elas não podem ser instaladas até serem aprovadas e publicadas.", pendingNone: "No momento, nenhuma extensão está aguardando análise.",
      hint: "O botão de instalar não faz nada? Atualize o Seliq ou use Baixar e abra o arquivo com o Seliq (Finder › Obter Informações › Abrir com › Seliq › Alterar Tudo). Se o PopClip estiver instalado, dar um clique duplo em um arquivo baixado abre o PopClip.",
    },
    "ar": {
      title: "امتدادات Seliq",
      metaDesc: "متجر امتدادات Seliq — امتدادات متوافقة مع PopClip بنقرة واحدة.",
      site: "موقع Seliq",
      modeToggle: "تبديل الوضع الداكن",
      langLabel: "اللغة",
      heroTitle: "اعثر على امتدادك المفضل التالي.",
      heroSub: "{n} امتداد لـ Seliq — متوافقة مع PopClip ومجانية وعلى بُعد نقرة واحدة.",
      searchPh: "ابحث بالاسم أو الوصف أو المعرّف",
      sort: "ترتيب",
      sortAsc: "الاسم أ–ي",
      sortDesc: "الاسم ي–أ",
      sortSize: "الأصغر أولًا",
      all: "الكل",
      results: "{n} نتيجة",
      none: "لا توجد امتدادات تطابق بحثك.",
      download: "تنزيل",
      copyLink: "نسخ الرابط",
      copied: "تم النسخ",
      details: "التفاصيل",
      hide: "طيّ",
      identifier: "المعرّف",
      checksum: "SHA-256",
      source: "المصدر",
      category: "الفئة",
      license: "الترخيص",
      size: "الحجم",
      version: "الإصدار",
      copy: "نسخ",
      showMore: "عرض المزيد",
      showing: "عرض {a} من {b}",
      error: "تعذّر تحميل الكتالوج. حاول مرة أخرى لاحقًا أو افتح index.json مباشرةً.",
      contribBadge: "Contrib",
      popclipBadge: "PopClip",
      legalPopclip: "امتدادات PopClip من تأليف Pilotmoon (Nicholas Moore) والمساهمين، مأخوذة دون تعديل من pilotmoon/PopClip-Extensions بموجب ترخيص MIT ومقدَّمة لأغراض التوافق. وSeliq ليس تابعًا لـ PopClip أو Pilotmoon ولا معتمدًا منهما.",
      legalContrib: "PopClip Contrib: من مجلد contrib في المستودع الأصلي — امتدادات من مساهمات المستخدمين أو تجريبية أو متخصصة قد تكون قديمة، وتُقدَّم كما هي.",
      install: "التثبيت في Seliq",
      dismiss: "إغلاق",
      pendingTab: "بانتظار المراجعة", pendingBadge: "قيد المراجعة", pendingSubmitted: "أُرسل في {date}",
      pendingNote: "امتدادات شاركها مستخدمو Seliq وتنتظر المراجعة. ولا يمكن تثبيتها قبل الموافقة عليها ونشرها.", pendingNone: "لا توجد امتدادات بانتظار المراجعة حاليًا.",
      hint: "إذا لم يستجب زر التثبيت، فحدّث Seliq أو استخدم «تنزيل» ثم افتح الملف باستخدام Seliq (Finder › الحصول على معلومات › فتح باستخدام › Seliq › تغيير الكل). وإذا كان PopClip مثبّتًا، فإن النقر المزدوج على ملف منزَّل يفتح PopClip.",
    },
  };
  // same detection as the Seliq website (assets/i18n.js)
  function detectLang() {
    for (const raw of navigator.languages?.length ? navigator.languages : [navigator.language || ""]) {
      const tag = raw.toLowerCase();
      if (tag.startsWith("zh")) return /hant|-tw|-hk|-mo/.test(tag) ? "zh-Hant" : "zh-Hans";
      const base = tag.split("-")[0];
      if (base === "pt") return "pt-BR";
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
  let all = [], iconFiles = {}, intentNames = {}, shown = PAGE, cat = "", pendingHash = "";
  // 「검토 대기」: Seliq 사용자가 공유해 관리자 검토를 기다리는 확장(이름·설명·아이콘·날짜만, 설치 불가). null = 불러오지 못함(탭 숨김)
  const PENDING_URL = "https://api.seliq.kr/v1/submissions/pending-public";
  let pending = null;
  const grid = $("#grid"), more = $("#more"), chipsEl = $("#chips"), countEl = $("#count");

  const hashCode = () => decodeURIComponent(location.hash.slice(1));

  // 검색: 모든 언어 설명 + 브랜드 별칭(이름이 영어라 「네이버」「구글」로도) + 띄어쓰기 없는 검색어(「네이버사전」)
  const ALIASES = { google: "구글 グーグル 谷歌", naver: "네이버 ネイバー", papago: "파파고 パパゴ", deepl: "딥엘",
    youtube: "유튜브 ユーチューブ", amazon: "아마존 アマゾン 亚马逊", coupang: "쿠팡", wikipedia: "위키백과 위키피디아 ウィキペディア 维基百科",
    chatgpt: "챗지피티" };
  const fold = (t) => t.normalize("NFKC").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC");
  const hayCache = new Map();
  function haystack(e) {
    let h = hayCache.get(e);
    if (h) return h;
    h = fold([e.name, e.shortcode, e.identifier || "", e.description || "", ...Object.values(e.descriptions || {})].join(" "));
    for (const [brand, alias] of Object.entries(ALIASES)) if (h.includes(brand)) h += " " + fold(alias);
    h += " " + h.replace(/\s+/g, "");
    hayCache.set(e, h);
    return h;
  }
  // 붙여 쓴 두 낱말도 맞게: 어느 한 곳에서 둘로 나눠 두 쪽 다 있으면 맞다
  // 띄어쓰기가 흔히 빠지는 한글·한자·가나만, 두 조각 모두 2글자 이상(라틴 글자는 "dict" → "d"+"ict"처럼 다 맞아 버린다)
  const CJK = /^[\u3040-\u30ff\u3130-\u318f\u4e00-\u9fff\uac00-\ud7a3]+$/;
  const has = (hay, w) => {
    if (hay.includes(w)) return true;
    if (w.length < 4 || !CJK.test(w)) return false;
    for (let i = 2; i <= w.length - 2; i++) if (hay.includes(w.slice(0, i)) && hay.includes(w.slice(i))) return true;
    return false;
  };

  function visibleList() {
    const q = $("#search").value.trim().toLowerCase();
    const sort = $("#sort").value;
    const target = hashCode();
    let list = all.filter((e) => !e.unlisted || e.shortcode === target);
    if (cat) list = list.filter((e) => (cat === "__seliq" ? e.origin !== "popclip" : e.category === cat));
    if (q) {
      const words = fold(q).split(/\s+/);
      list = list.filter((e) => {
        const hay = haystack(e);
        return words.every((w) => has(hay, w));
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
      </div>
      <div class="card-actions">
        <a class="btn btn-primary" href="seliq://install?shortcode=${encodeURIComponent(e.shortcode)}">${t("install")}</a>
        <a class="btn btn-secondary" href="${esc(safeUrl(e.download))}" download>${t("download")}</a>
      </div>
      <div class="detail"><p class="detail-hint">${esc(t("hint"))}</p><dl>
        ${row("identifier", e.identifier ? `<span>${esc(e.identifier)}</span>${copyBtn(e.identifier)}` : "")}
        ${row("checksum", `<span>${esc(e.sha256)}</span>${copyBtn(e.sha256)}`)}
        ${lang === "ko" && (e.intents || []).length ? row("intents", e.intents.map((id, i) => `<span class="intent${i === 0 ? " main" : ""}">${esc(intentNames[id] || id)}</span>`).join(""), true) : ""}
        ${row("category", esc(e.category || "—"), true)}
        ${row("version", esc(e.version), true)}
        ${row("source", up ? `<a href="${esc(up)}" target="_blank" rel="noopener">${esc(e.upstream)}</a>` : esc(e.upstream || ""), true)}
      </dl></div>
    </article>`;
  }

  function pendingList() {
    const q = $("#search").value.trim().toLowerCase();
    const words = q ? q.split(/\s+/) : [];
    return (pending || []).filter((p) => words.every((w) => `${p.name} ${p.description}`.toLowerCase().includes(w)));
  }

  // 검토 대기 카드: 설치·다운로드 버튼 없음, 「검토 중」 배지
  function pendingCardHtml(p, i) {
    const d = p.submitted_at ? new Date(p.submitted_at) : null;
    const date = d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric" }) : "";
    const fake = { name: p.name || "?", icon: p.icon || "", identifier: p.name || "?", shortcode: "" };
    return `<article class="card pending" style="animation-delay:${Math.min(i * 14, 300)}ms">
      <div class="card-top">
        ${tileHtml(fake)}
        <div class="card-main">
          <h2 class="card-name"><span>${esc(p.name)}</span><span class="badge review">${esc(t("pendingBadge"))}</span></h2>
          <p class="card-desc">${esc(p.description || "")}</p>
        </div>
      </div>
      <div class="card-foot"><span class="facts">${esc(date ? t("pendingSubmitted", { date }) : "")}</span></div>
    </article>`;
  }

  function renderPending() {
    const list = pendingList();
    countEl.textContent = t("results", { n: list.length });
    more.innerHTML = "";
    grid.innerHTML = `<p class="pending-note">${esc(t("pendingNote"))}</p>` +
      (list.length ? list.map(pendingCardHtml).join("") : `<p class="empty">${esc(t("pendingNone"))}</p>`);
  }

  function render() {
    if (cat === "__pending") { renderPending(); return; }
    const list = visibleList();
    const target = hashCode();
    const ti = list.findIndex((e) => e.shortcode === target);
    if (ti >= shown) shown = ti + 1;
    const slice = list.slice(0, shown);
    countEl.textContent = t("results", { n: list.length });
    if (!list.length) { grid.innerHTML = `<p class="empty">${esc(t("none"))}</p>`; more.innerHTML = ""; return; }
    grid.innerHTML = slice.map(cardHtml).join("");
    renderMore(list);
    if (pendingHash) { const h = pendingHash; pendingHash = ""; focusCard(h); }
  }

  // 「더 보기」: 이미 보이는 카드는 그대로 두고 다음 카드만 아래에 이어 붙인다(전체를 다시 그리면 모든 카드가 다시 나타나며 깜빡인다).
  function showMore() {
    const list = visibleList();
    const from = shown;
    shown = Math.min(shown + PAGE, list.length);
    grid.insertAdjacentHTML("beforeend", list.slice(from, shown).map(cardHtml).join(""));
    renderMore(list);
    $("#show-more")?.focus({ preventScroll: true });
  }

  function renderMore(list) {
    more.innerHTML = list.length > shown ? `${esc(t("showing", { a: Math.min(shown, list.length), b: list.length }))}<br><br><button type="button" id="show-more">${esc(t("showMore"))}</button>` : "";
    $("#show-more")?.addEventListener("click", showMore);
  }

  function renderChips() {
    const counts = {};
    let seliq = 0;
    for (const e of all) { if (e.unlisted) continue; if (e.origin !== "popclip") seliq++; if (e.category) counts[e.category] = (counts[e.category] || 0) + 1; }
    const order = ["PopClip", "PopClip Contrib"];
    const cats = Object.keys(counts).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b));
    const chips = [["", t("all"), all.filter((e) => !e.unlisted).length]]
      .concat(seliq && !counts.Seliq ? [["__seliq", "Seliq", seliq]] : [], cats.map((c) => [c, c, counts[c]]),
        pending ? [["__pending", t("pendingTab"), pending.length]] : []);
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
    if (cat === "__pending") cat = "";
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
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
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
    $("#hint-text").textContent = t("hint");
    $("#hint-x").setAttribute("aria-label", t("dismiss"));
    $("#legal-popclip").textContent = t("legalPopclip");
    $("#legal-contrib").textContent = t("legalContrib");
    if (all.length) {
      $("#hero-sub").textContent = t("heroSub", { n: all.filter((e) => !e.unlisted).length });
      renderChips(); render();
    }
  }
  $("#lang-select").addEventListener("change", (e) => { lang = e.target.value; store.set("seliq-lang", lang); applyLang(); });

  /* ---------- install hint (dismissible, remembered) ---------- */
  const hintEl = $("#hint");
  hintEl.hidden = store.get("seliq-hint-dismissed") === "1";
  $("#hint-x").addEventListener("click", () => { hintEl.hidden = true; store.set("seliq-hint-dismissed", "1"); });

  /* ---------- load ---------- */
  applyLang();
  // 검토 대기 목록(실패해도 카탈로그는 그대로 — 탭만 안 보인다). 쿠키 없이 부른다.
  fetch(PENDING_URL, { credentials: "omit" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || !Array.isArray(d.items)) return;
      pending = d.items
        .filter((p) => p && typeof p.name === "string" && p.name)
        .map((p) => ({ name: String(p.name).slice(0, 60), description: typeof p.description === "string" ? p.description.slice(0, 200) : "", icon: typeof p.icon === "string" ? p.icon.slice(0, 60) : "", submitted_at: p.submitted_at }));
      if (all.length) { renderChips(); if (cat === "__pending") render(); }
    })
    .catch(() => {});
  Promise.all([
    fetch("./index.json").then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    fetch("./icon-files.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    fetch("./sense-intents.json").then((r) => (r.ok ? r.json() : [])).catch(() => []),
  ]).then(([data, icons, intents]) => {
    intentNames = Object.fromEntries((Array.isArray(intents) ? intents : []).map((i) => [i.id, i.ko]));
    all = data.extensions || data;
    iconFiles = icons || {};
    pendingHash = hashCode();
    applyLang();
  }).catch(() => {
    grid.innerHTML = `<p class="error">${esc(t("error"))}</p>`;
  });
})();
