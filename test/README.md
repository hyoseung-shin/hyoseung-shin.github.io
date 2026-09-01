# hyoseung-shin.github.io

개인 포트폴리오. 정적 파일만으로 구성되어 있으며 빌드 단계가 없습니다.
리포지토리에 파일을 올리면 GitHub Pages가 그대로 배포합니다.

## 파일 구조

```
/
├─ .nojekyll            Jekyll 처리 비활성화 (필수)
├─ index.html           메인 페이지
├─ research.html        전체 아카이브 + Knowledge Graph
├─ styles.css           공용 스타일
├─ app.js               공용 로직 (JSON 로딩 · 렌더 · 내비 · 테마)
├─ profile.json         프로필 · 학력 · 수상 · 활동 데이터
├─ research.json        논문 · 학회 · 특허 · 표준 · 프로젝트 데이터
├─ avatar/              증명사진, CV
├─ journal/domestic/    저널 PDF 및 썸네일 이미지
├─ conference/          학회 PDF
├─ awards/              상장 PDF
├─ pro_act/             수료증 PDF
└─ projects/            프로젝트 산출물
```

## 내용 수정

HTML은 건드리지 않습니다. **`profile.json`과 `research.json`만 수정하면
페이지에 반영됩니다.**

- 논문 추가 → `research.json`의 `journal.domestic` 또는 `journal.international` 배열에 항목 추가
- 학회 발표 추가 → `research.json`의 `conference` 배열
- 수상 · 활동 · 학력 → `profile.json`의 해당 배열

메인 페이지는 각 카테고리 최신 3건을 보여주고 나머지는 "전체 보기"로 펼칩니다.
카테고리가 비어 있으면 메인에서는 숨겨지고, `research.html` 아카이브에서는
분류 유지를 위해 표시됩니다.

### 링크 자리표시자

`url` 값이 `./404NotFound` 또는 `https://to.be.continue/` 이면
클릭할 수 없는 회색 텍스트로 표시됩니다. 실제 파일이 준비되면 경로만
바꿔 넣으면 됩니다.

### 히어로 문구

`profile.json`의 `bio` 배열이 히어로 영역에 들어갑니다.

- `bio[0]` → 큰 글씨 리드 문장 (한 문장 권장)
- `bio[1]` 이후 → 아래 작은 문단

`{affiliation}` 자리표시자는 `affiliation` 객체의 링크로 치환됩니다.
`<strong>`, `<a>` 등 HTML 태그를 그대로 쓸 수 있습니다.

## 캐시

`styles.css`와 `app.js`는 `?v=날짜` 쿼리로 불러옵니다.
두 파일을 수정했는데 반영이 안 보이면 `index.html`과 `research.html`의
`?v=` 값을 새 날짜로 바꿔주세요. JSON은 `cache: "no-store"`라 즉시 반영됩니다.

## 로컬 확인 (선택)

브라우저는 `file://`에서 JSON 요청을 차단하므로, 로컬에서 열면
데이터가 비어 보입니다. 배포 환경에서는 문제가 없습니다.
굳이 로컬에서 보려면 아무 정적 서버나 쓰면 됩니다.

```
python3 -m http.server 8000
```
