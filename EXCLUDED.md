# 제외된 확장 / Excluded extensions

## source (220, 제외 없음 / none excluded)

기준 / Source: pilotmoon/PopClip-Extensions @ ea2225b8c4cd9c89411b4b292da753b9fdbbd99d (`source/*.popclipext` 220개)

검사 / Check: Seliq 앱의 `everyExtensionLoads` 코퍼스 테스트(`scripts/test.sh --filter everyExtensionLoads`) — 220개 중 220개 로딩, 실패 0개. 5 MB zip 한도 초과 없음(최대 약 0.9 MB).
Seliq app corpus test: 220 of 220 extensions loaded, 0 failures. No archive exceeds the 5 MB limit (largest about 0.9 MB).

제외된 확장 / Excluded: **없음 / none**

앞으로 로딩 실패나 크기 초과로 제외하는 확장은 아래에 `폴더명 — 사유 / reason` 형식으로 적습니다.
Future exclusions (load failures or oversize archives) are listed below as `Folder - reason`.

## contrib (158 중 11 제외 / 11 of 158 excluded)

기준 / Source: pilotmoon/PopClip-Extensions @ ea2225b8c4cd9c89411b4b292da753b9fdbbd99d (`contrib/*.popclipext` 158개). 검사는 위와 같은 코퍼스 테스트(147개 로딩, 11개 실패). 크기 초과 없음.
Same corpus test: 147 loaded, 11 failed. No oversize archives.

| 폴더 / Folder | 사유 / Reason |
|---|---|
| Accordance | Config.json을 해석할 수 없음 / Config.json cannot be parsed |
| CyrillicLatinSwitcher | `#popclip` 표시 줄이 없어 스니펫이 아님 / snippet without `#popclip` marker line |
| EvernoteCodeBlock | 키 조합(keychar+modifiers 딕셔너리)을 해석할 수 없음 / unsupported key combo format |
| MicrosoftWord | Config 파일 없음 / no Config file |
| OneNote | Config 파일 없음 / no Config file |
| OpenAIPrompt | 지원하지 않는 라이브러리 기능 `valibot.minLength` / unsupported library feature |
| PreviewHighlight | 키 조합을 해석할 수 없음 / unsupported key combo format |
| SelectAllAndCopy | 키 조합을 해석할 수 없음 / unsupported key combo format |
| TestIconStrings | Config 파일 없음 / no Config file |
| TestJavaScript | TypeScript `import ... = require()` 미지원 / unsupported TypeScript syntax |
| Underline | 키 조합을 해석할 수 없음 / unsupported key combo format |
