# Seliq Extensions

## 한국어

[Seliq](https://github.com/seliq-app)(PopClip 호환 텍스트 선택 액션 바 macOS 앱)용 공개 확장 스토어 저장소입니다.
Seliq은 PopClip과 "호환"되는 앱일 뿐이며, PopClip 및 Pilotmoon과는 제휴 관계가 아닙니다.

### Seliq이 이 저장소를 사용하는 방식

GitHub Pages로 배포되는 목록을 앱이 읽습니다.

- 목록: <https://seliq-app.github.io/seliq-extensions/index.json>
- 다운로드: `https://seliq-app.github.io/seliq-extensions/dl/<shortcode>-<version>.popclipextz`

`index.json`(schema 1)은 각 확장의 `shortcode`, `identifier`, `name`, `description`, `version`, `category`, `icon`, `download`, `sha256`, `size`, `license`, `upstream`, `unlisted`를 담습니다. 앱은 내려받은 파일의 `sha256`을 검증한 뒤 설치합니다.
각 `.popclipextz`는 루트에 `<shortcode>.popclipext/` 폴더 하나만 든 zip입니다.

### 확장 추가 방법 (PR)

1. `extensions/<shortcode>/meta.json`과 `extensions/<shortcode>/ext/`(Config.yaml/json/plist, js, 아이콘 등)를 추가합니다. shortcode는 `[a-z0-9-]+`.
2. `meta.json`: `{ "name", "description", "version", "license"(SPDX, 필수), "category"?, "icon"?, "upstream"?, "unlisted"? }`
3. `node scripts/build-index.mjs`로 로컬 검증합니다(Node 18+ 와 시스템 `zip` 필요, 추가 의존성 없음). 결과는 `_site/`에 생성되며 커밋하지 않습니다.
4. PR을 열고 템플릿 체크리스트를 채웁니다. `main`에 병합되면 자동으로 배포됩니다.

### 라이선스

이 저장소는 MIT입니다(`LICENSE`). 일부 확장은 [pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions)(MIT)에서 가져왔으며, 원 라이선스와 저작권 고지는 `NOTICE`에 있습니다. 각 확장의 라이선스는 `meta.json`의 `license`를 따릅니다.

## English

Public extension store for [Seliq](https://github.com/seliq-app), a macOS text-selection action bar that is PopClip-compatible.
Seliq is "PopClip-compatible" only; it is not affiliated with or endorsed by PopClip or Pilotmoon.

### How Seliq consumes this repo

The app reads a catalog published via GitHub Pages:

- Catalog: <https://seliq-app.github.io/seliq-extensions/index.json>
- Downloads: `https://seliq-app.github.io/seliq-extensions/dl/<shortcode>-<version>.popclipextz`

`index.json` (schema 1) lists, per extension, `shortcode`, `identifier`, `name`, `description`, `version`, `category`, `icon`, `download`, `sha256`, `size`, `license`, `upstream`, `unlisted`. The app verifies the downloaded file against `sha256` before installing. Each `.popclipextz` is a zip whose root holds exactly one `<shortcode>.popclipext/` folder.

### Adding an extension (PR flow)

1. Add `extensions/<shortcode>/meta.json` and `extensions/<shortcode>/ext/` (Config.yaml/json/plist, js, icons...). Shortcode must match `[a-z0-9-]+`.
2. `meta.json`: `{ "name", "description", "version", "license" (SPDX, required), "category"?, "icon"?, "upstream"?, "unlisted"? }`
3. Validate locally with `node scripts/build-index.mjs` (Node 18+ and system `zip`; no extra dependencies). Output goes to `_site/` and is never committed.
4. Open a PR and complete the template checklist. Merging to `main` deploys automatically.

### License

MIT (`LICENSE`). Some extensions are derived from [pilotmoon/PopClip-Extensions](https://github.com/pilotmoon/PopClip-Extensions) (MIT); the original license and copyright notice are in `NOTICE`. Each extension's license is given by `license` in its `meta.json`.
