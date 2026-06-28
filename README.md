<div align="center">

# 🎓 Hyoseung Shin — Academic Portfolio

### 영상 코딩 표준(VVC/VCM) 연구 포트폴리오 & 인터랙티브 Knowledge Graph

GitHub Pages · Vanilla JS · D3.js · JSON-driven

![Live](https://img.shields.io/badge/Live-hyoseung--shin.github.io-2c3e50)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-222)
![Style](https://img.shields.io/badge/Design-Editorial%20%C3%97%20Bitstream-8b5cf6)
![Theme](https://img.shields.io/badge/Theme-Dark%20%7C%20Light-6d28d9)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-success)

🔗 **<https://hyoseung-shin.github.io>**

</div>

---

## 🏆 핵심 요약

| 항목     | 내용                                                                                          |
| ------ | ------------------------------------------------------------------------------------------- |
| 유형     | 개인 학술 포트폴리오 + 인터랙티브 Knowledge Graph                                                          |
| 배포     | GitHub Pages (`username.github.io`)                                                          |
| 메인 페이지 | Introduction · Analysis · Research(최신 3건) · Education · Awards · Activities · Beyond         |
| 리서치 페이지 | 전체 연구 실적 + Knowledge Graph(D3.js) + 자동 통계(Analysis)                                          |
| 데이터    | `profile.json`(개인정보) · `research.json`(연구실적) — 2개 JSON으로 전체 콘텐츠 관리                           |
| 디자인    | Editorial × Bitstream · 퍼플 × 흑백 · 다크/라이트 토글                                                 |
| 기술     | HTML5 · CSS(커스텀 디자인 시스템) · Vanilla JavaScript · D3.js · Pretendard                          |
| 반응형    | 모바일 · 태블릿 · 데스크톱 최적화                                                                         |
| 빌드     | 무빌드(no build step) — 정적 파일만으로 동작                                                             |

---

## 🚀 프로젝트 소개

영상 코딩·압축 표준(**VVC / VCM**) 분야 연구자 **신효승(Hyoseung Shin)** 의 학술 포트폴리오 웹사이트입니다.
연구 실적 요약과 경력을 정리한 **메인 페이지**, 그리고 전체 실적과 논문·프로젝트·공동연구자를 잇는
**Knowledge Graph**를 제공하는 **리서치 페이지**로 구성됩니다.

모든 콘텐츠는 **2개의 JSON 파일**로 분리되어 있어, HTML/CSS를 건드리지 않고 데이터만 수정하면
미리보기·전체목록·통계·그래프가 자동으로 갱신됩니다. 별도의 빌드 과정 없이 정적 파일만으로 동작하며,
GitHub Pages에 그대로 배포됩니다.

### 주요 특징

- 데이터(JSON)와 표현(HTML/CSS) 완전 분리 — 손쉬운 콘텐츠 갱신
- 정보가 없는 섹션은 자동으로 **To Be Continue** 표시
- D3.js 기반 인터랙티브 **Knowledge Graph** — `research.json`에서 노드 자동 파생
- 메인 카테고리별 최신 3건 미리보기 + **more view →** 로 전체 실적 페이지 이동
- 다크/라이트 토글, 퍼플 × 흑백 Editorial 디자인, 반응형 레이아웃, 모바일 메뉴

### 사이트 구성

```
메인 페이지 (index.html)
    │
    ├─ Introduction / Analysis / Education / Honors & Awards / Activities / Beyond
    ├─ Research ─ Journal · Conference · Patent · International Standard · Project (각 최신 3건)
    │
    └─ "more view →"
            ↓
리서치 페이지 (research.html)
    ├─ Knowledge Graph (D3.js) — 논문 · 프로젝트 · 공동연구자
    └─ 전체 연구 실적 (카테고리별 전체 목록)
```

---

## ⚡ 로컬 실행

정적 사이트이므로 간단한 HTTP 서버만 있으면 됩니다.

```bash
git clone https://github.com/hyoseung-shin/hyoseung-shin.github.io.git
cd hyoseung-shin.github.io

# 정적 서버 실행 (둘 중 하나)
python3 -m http.server 8000
# 또는
npx serve .

# 브라우저에서 http://localhost:8000 접속
```

> ⚠️ 파일을 직접 더블클릭(`file://`)하면 `fetch`로 불러오는 JSON 데이터가 브라우저 보안 정책상
> 차단됩니다. 로컬에서는 반드시 HTTP 서버로 여세요. (GitHub Pages 배포 시엔 정상 동작)

---

## 🏗️ 프로젝트 구조

```
hyoseung-shin.github.io/
├── index.html          메인 페이지 (Introduction → Analysis → Research → Education → Awards → Activities → Beyond)
├── research.html       리서치 페이지 (전체 실적 + Knowledge Graph)
├── styles.css          공용 스타일시트 (디자인 시스템 · 다크/라이트 · 반응형)
├── profile.json        개인정보 전용 데이터 (이름 · 소개 · 링크 · 학력 · 수상 · 활동 · 기타)
├── research.json       연구실적 전용 데이터 (journal · conference · patent · standard · project)
│
├── avatar/             프로필 이미지 및 CV PDF
├── journal/            저널 논문 PDF 및 썸네일 이미지
├── conference/         컨퍼런스 자료 PDF
├── awards/             수상 증명서 PDF
├── pro_act/            활동 증명서 PDF
├── projects/           프로젝트 자료 PDF
└── README.md           이 파일
```

---

## 🗂️ 콘텐츠 관리

### 1. 개인정보 — `profile.json`

이름, 소개, 연락처 링크, 학력, 수상, 활동, 기타 경력을 관리합니다.

```json
{
  "name": "Hyoseung Shin",
  "nameKo": "신효승",
  "avatar": "./avatar/id_photo.jpg",
  "bio": ["소개 문단 …", "… {affiliation} …"],
  "links": {
    "email": "...", "linkedin": "...", "github": "...",
    "scholar": "...", "cv": "./avatar/...pdf", "orcid": "..."
  },
  "education":  [ { "degree": "...", "univ": "...", "period": "..." } ],
  "awards":     [ { "title": "...", "desc": "... | 2025", "link": "..." } ],
  "activities": [ { "title": "...", "period": "...", "org": "...", "link": "..." } ],
  "others":     [ { "title": "...", "period": "...", "org": "...", "details": ["..."] } ]
}
```

| 필드            | 설명                                                                    |
| ------------- | --------------------------------------------------------------------- |
| `bio`         | 문단 배열. `{affiliation}` 토큰은 소속 링크로 자동 치환. `<strong>` 등 HTML 사용 가능       |
| `links`       | `email`은 `mailto:`로, 나머지는 새 탭 링크로 렌더링 (빈 값도 항목은 유지)                    |
| `others`      | `details` 배열이 있으면 펼침(toggle) 카드, 없으면 단순 카드 (`<`,`>`는 `&lt;`,`&gt;` 입력) |

### 2. 연구실적 — `research.json`

저널·컨퍼런스·특허·표준·프로젝트를 관리합니다. 배열에 항목을 추가하면 **메인 미리보기 · 전체 목록 ·
Analysis 차트 · Knowledge Graph가 모두 자동 갱신**됩니다.

```json
{
  "journal": { "international": [], "domestic": [ /* 논문 객체 */ ] },
  "conference": [ /* 학회 객체 */ ],
  "patent": [], "standard": [],
  "project": [ /* 프로젝트 객체 */ ]
}
```

**논문/항목 객체 필드**

| 필드        | 설명                                                                  |
| --------- | ------------------------------------------------------------------- |
| `id`      | 그래프 노드 식별자 — **중복 불가** 고유값                                          |
| `title`   | 제목                                                                  |
| `authors` | 저자 배열. 본인(`Hyoseung Shin`/`신효승`)은 그래프 중심 `Me` 노드, 나머지는 공동연구자 노드 자동 생성 |
| `venue`   | 저널/학회 전체 명칭 (축약 없이)                                                  |
| `year`    | 연도 — Analysis 차트(연도별 집계)에 사용                                        |
| `image`   | 저널 카드 썸네일 (선택)                                                      |
| `links`   | `[ { "name": "...", "url": "..." } ]` 링크 버튼 배열                      |

**링크 버튼 규칙**

| 카테고리                            | 버튼                                  |
| ------------------------------- | ----------------------------------- |
| Journal                         | `code` · `paper` · `poster` (전체 표시) |
| Conference · Patent · Standard · Project | 관련 문서 PDF 버튼 1개                      |

> URL이 `./404NotFound` 또는 `to.be.continue`처럼 준비되지 않은 경우, 자동으로 비활성 `· TBC` 칩으로
> 표시되어 잘못된 링크 이동을 방지합니다.

**예시: 새 논문 추가** — `journal.domestic` 배열에 객체 하나만 추가

```json
{
  "id": "j-2027-new",
  "title": "New Paper Title",
  "authors": ["Hyo-seung Shin", "Co-author"],
  "venue": "Journal Name",
  "year": 2027,
  "links": [
    { "name": "code",  "url": "https://github.com/..." },
    { "name": "paper", "url": "./journal/domestic/2027_new.pdf" }
  ]
}
```

---

## 🕸️ Knowledge Graph

`research.html`의 그래프는 `research.json`을 읽어 **실시간으로 노드/링크를 파생**합니다.
별도의 그래프 데이터 파일을 관리할 필요가 없습니다.

| 노드 타입                 | 설명                          |
| --------------------- | --------------------------- |
| `Me`                  | 중심 노드(본인)                   |
| `Journal` / `Conference` | 논문 노드                       |
| `Project`             | 프로젝트 노드                     |
| `Collaborator`        | 공동연구자 (`authors`에서 자동 생성)   |

- **연결**: 저자 ↔ 논문, Me ↔ 본인 프로젝트
- **조작**: 드래그 / 휠 줌 / 노드 클릭(상세 패널) / 범례 필터 / 검색 / Force 슬라이더 / Reset View

---

## 📊 Analysis (자동 계산)

메인 페이지 Analysis 섹션은 `research.json`에서 다음을 자동 산출합니다.

| 차트                    | 내용                          |
| --------------------- | --------------------------- |
| Stats                 | Total · Journal · Conference · Standards 카운트 |
| Papers per Year       | 연도별 논문 수                    |
| Int'l vs Domestic     | 국제/국내 비율                    |
| Journal vs Conference | 저널/컨퍼런스 비율                  |

> 데이터가 없으면 `To Be Continue`가 표시됩니다.

---

## 🎨 커스터마이징

### 색상 (다크/라이트)

`styles.css`의 `:root[data-theme="..."]`에서 테마 변수를 수정합니다.

```css
:root[data-theme="dark"]{
    --bg:#0a0a0c;            /* 배경 */
    --text:#f4f4f6;          /* 본문 텍스트 */
    --accent:#a78bfa;        /* 시그니처 액센트 (퍼플) */
    --accent-strong:#8b5cf6; /* 강조 액센트 */
    --line:#26262c;          /* 구분선 */
}
:root[data-theme="light"]{
    --bg:#f6f6f3;
    --text:#0c0c0f;
    --accent:#7c3aed;
    --accent-strong:#6d28d9;
    --line:#e3e3df;
}
```

### 폰트

`styles.css`의 `body`에서 폰트 변수를 수정합니다.

```css
body{
    --font-sans:'Pretendard', 'Helvetica Neue', sans-serif;  /* 본문 */
    --font-mono:'SF Mono', Menlo, monospace;                 /* 라벨 · 메타 */
}
```

### 페이지 연결

- 메인 → 리서치: Research 섹션의 **more view →** / 네비게이션의 **Graph ↗**
- 리서치 → 메인: 헤더 로고 / **← Home** / **← Back to Home**

---

## 📱 반응형 디자인

| 브레이크포인트   | 동작                                              |
| --------- | ----------------------------------------------- |
| `≤ 980px` | 상단 네비게이션 → 햄버거 메뉴                               |
| `≤ 920px` | Knowledge Graph · Analysis 차트 세로 스택             |
| `≤ 860px` | 메인 히어로 **이름 → 사진 → 소개·링크** 1단 재배치               |
| `≤ 640px` | 저널 카드(썸네일+본문) 세로 정렬                            |

---

## 🐛 문제 해결

| 증상                     | 점검 사항                                                  |
| ---------------------- | ------------------------------------------------------ |
| 데이터가 안 보임 / 빈 화면       | `file://` 대신 HTTP 서버로 실행 · JSON 문법(쉼표·따옴표) · 경로 확인     |
| 그래프가 안 보임              | D3.js(CDN) 로드 · `research.json` 데이터 유무 · `id` 중복 확인     |
| 스타일이 안 먹힘              | `styles.css` 경로 · 브라우저 캐시 삭제(`Ctrl+Shift+R`)           |
| 일부 링크가 `TBC`로 비활성      | URL이 `404NotFound`/`to.be.continue` — 실제 URL로 교체 시 활성화 |

---

## 📝 라이선스

본 저장소는 **신효승(Hyoseung Shin)** 의 개인 학술 포트폴리오입니다. 사이트 콘텐츠(논문/이력/이미지 등)의
무단 복제·재배포를 제한합니다. 코드 구조는 참고용으로 활용하실 수 있습니다.

---

<div align="center">

🔗 [hyoseung-shin.github.io](https://hyoseung-shin.github.io) · Yonsei University

</div>
