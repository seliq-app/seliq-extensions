# 제외된 확장 / Excluded extensions

기준 / Source: pilotmoon/PopClip-Extensions @ ea2225b8c4cd9c89411b4b292da753b9fdbbd99d (`source/*.popclipext` 220개)

검사 / Check: Seliq 앱의 `everyExtensionLoads` 코퍼스 테스트(`scripts/test.sh --filter everyExtensionLoads`) — 220개 중 220개 로딩, 실패 0개. 5 MB zip 한도 초과 없음(최대 약 0.9 MB).
Seliq app corpus test: 220 of 220 extensions loaded, 0 failures. No archive exceeds the 5 MB limit (largest about 0.9 MB).

제외된 확장 / Excluded: **없음 / none**

앞으로 로딩 실패나 크기 초과로 제외하는 확장은 아래에 `폴더명 — 사유 / reason` 형식으로 적습니다.
Future exclusions (load failures or oversize archives) are listed below as `Folder - reason`.
