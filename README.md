# Seliq Extensions

## 한국어

[Seliq](https://github.com/seliq-app)(PopClip 호환 텍스트 선택 액션 바 macOS 앱)용 공개 확장 스토어 저장소입니다.
Seliq은 PopClip과 "호환"되는 앱일 뿐이며, PopClip 및 Pilotmoon과는 제휴 관계가 아닙니다.

### PopClip 확장 안내

`origin`이 `popclip`인 확장(현재 220개 전체)은 **Pilotmoon(Nicholas Moore)과 기여자들이 만든 PopClip 확장**입니다.
[pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions)(MIT 라이선스)의 커밋 `ea2225b8c4cd9c89411b4b292da753b9fdbbd99d`에서 **수정 없이 그대로** 가져와 호환성을 위해 제공합니다.
Seliq은 PopClip/Pilotmoon과 제휴·후원 관계가 아니며, 이들 확장의 저작권은 원저작자에게 있습니다(`NOTICE` 참고). 로딩되지 않아 제외한 확장은 `EXCLUDED.md`에 적습니다.

### Seliq이 이 저장소를 사용하는 방식

GitHub Pages로 배포되는 목록을 앱이 읽습니다.

- 목록: <https://seliq-app.github.io/seliq-extensions/index.json>
- 다운로드: `https://seliq-app.github.io/seliq-extensions/dl/<shortcode>-<version>.popclipextz`

`index.json`(schema 1)은 각 확장의 `shortcode`, `identifier`, `name`, `description`, `version`, `category`, `icon`, `download`, `sha256`, `size`, `license`, `upstream`, `unlisted`, `origin`(`"popclip"` 또는 `null`)을 담습니다. 앱은 내려받은 파일의 `sha256`을 검증한 뒤 설치합니다.
각 `.popclipextz`는 루트에 `<shortcode>.popclipext/` 폴더 하나만 든 zip입니다.

### 확장 추가 방법 (PR)

1. `extensions/<shortcode>/meta.json`과 `extensions/<shortcode>/ext/`(Config.yaml/json/plist, js, 아이콘 등)를 추가합니다. shortcode는 `[a-z0-9-]+`.
2. `meta.json`: `{ "name", "description", "version", "license"(SPDX, 필수), "category"?, "icon"?, "upstream"?, "unlisted"?, "origin"? }`
3. `node scripts/build-index.mjs`로 로컬 검증합니다(Node 18+ 와 시스템 `zip` 필요, 추가 의존성 없음). 결과는 `_site/`에 생성되며 커밋하지 않습니다.
4. PR을 열고 템플릿 체크리스트를 채웁니다. `main`에 병합되면 자동으로 배포됩니다.

### 라이선스

이 저장소는 MIT입니다(`LICENSE`). `origin`이 `popclip`인 확장은 [pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions)(MIT)에서 가져왔으며, 원 라이선스와 저작권 고지는 `NOTICE`에 있습니다. 각 확장의 라이선스는 `meta.json`의 `license`를 따릅니다.

## English

Public extension store for [Seliq](https://github.com/seliq-app), a macOS text-selection action bar that is PopClip-compatible.
Seliq is "PopClip-compatible" only; it is not affiliated with or endorsed by PopClip or Pilotmoon.

### PopClip extensions

Extensions whose `origin` is `popclip` (all 220 entries at this commit) are **PopClip extensions by Pilotmoon (Nicholas Moore) and contributors**.
They are taken **unmodified** from [pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions) (MIT License) at commit `ea2225b8c4cd9c89411b4b292da753b9fdbbd99d` and provided for compatibility.
Seliq is not affiliated with or endorsed by PopClip or Pilotmoon; copyright of these extensions stays with their original authors (see `NOTICE`). Extensions that could not be loaded are listed in `EXCLUDED.md`.

### How Seliq consumes this repo

The app reads a catalog published via GitHub Pages:

- Catalog: <https://seliq-app.github.io/seliq-extensions/index.json>
- Downloads: `https://seliq-app.github.io/seliq-extensions/dl/<shortcode>-<version>.popclipextz`

`index.json` (schema 1) lists, per extension, `shortcode`, `identifier`, `name`, `description`, `version`, `category`, `icon`, `download`, `sha256`, `size`, `license`, `upstream`, `unlisted`, `origin` (`"popclip"` or `null`). The app verifies the downloaded file against `sha256` before installing. Each `.popclipextz` is a zip whose root holds exactly one `<shortcode>.popclipext/` folder.

### Adding an extension (PR flow)

1. Add `extensions/<shortcode>/meta.json` and `extensions/<shortcode>/ext/` (Config.yaml/json/plist, js, icons...). Shortcode must match `[a-z0-9-]+`.
2. `meta.json`: `{ "name", "description", "version", "license" (SPDX, required), "category"?, "icon"?, "upstream"?, "unlisted"?, "origin"? }`
3. Validate locally with `node scripts/build-index.mjs` (Node 18+ and system `zip`; no extra dependencies). Output goes to `_site/` and is never committed.
4. Open a PR and complete the template checklist. Merging to `main` deploys automatically.

### License

MIT (`LICENSE`). Extensions with `origin` = `popclip` are derived from [pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions) (MIT); the original license and copyright notice are in `NOTICE`. Each extension's license is given by `license` in its `meta.json`.
