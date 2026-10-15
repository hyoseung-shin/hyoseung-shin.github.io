<div align="center">

# 🎓 Hyoseung Shin — Academic Portfolio

### 영상 코딩 표준(VVC/VCM) 연구 포트폴리오 & 인터랙티브 Knowledge Graph

GitHub Pages · Vanilla JS · D3.js · JSON-driven

![Live](https://img.shields.io/badge/Live-hyoseung--shin.github.io-2c3e50)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-222)
![Style](https://img.shields.io/badge/Design-Surfaces%20%C3%97%20Decoding%20portrait-12161c)
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
| 메인 페이지 | Introduction · Research(최신 3건) · Education · Activities · Honors & Awards · Beyond Research |
| 리서치 페이지 | 전체 연구 실적 + Knowledge Graph(D3.js)                                                               |
| 데이터    | `profile.json`(개인정보) · `research.json`(연구실적) — 2개 JSON으로 전체 콘텐츠 관리                           |
| 디자인    | 3단계 구분선(섹션 2px · 카테고리 1px · 실적 사이 옅은 1px) · 상단 바 + Research 드롭다운 · 큰 프로필 사진 + 디코딩 막대 · 저널 논문 그림 썸네일 · 알약형 링크 · 디코딩되는 프로필 사진 · 다크/라이트 토글 |
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
- 항목이 없는 카테고리와 준비되지 않은 링크는 화면에 표시하지 않음
- D3.js 기반 인터랙티브 **Knowledge Graph** — `research.json`에서 노드 자동 파생, 첫 배치 후 화면에 맞춰 자동 확대
- 메인에는 `research.json`에서 `"selected": true`로 표시한 항목만 카테고리별 최대 3건 표시 (표시한 항목이 없으면 최신 3건) + **전체 0N건 보기** 로 전체 실적 페이지 이동
- 학회 논문도 그림 자리가 있으며, `image`가 없으면 학회 약칭과 연도가 들어간 블록 모자이크가 자동으로 채워짐
- 논문마다 `Int.` / `국내` 표시 (저널은 `international`/`domestic` 구분, 학회는 장소에 Korea가 있으면 국내)
- 디자인 포인트: 프로필 사진이 로드될 때 **큰 블록의 휘도(Y)만 → 색(Cb·Cr) 추가 → 블록이 작아지며 원본**으로 디코딩되듯 나타남 (`prefers-reduced-motion`이면 바로 표시). 사진 아래 6칸 막대가 디코딩 단계마다 하나씩 켜짐 — 휘도 단계는 회색, 색이 들어오는 단계부터 파랑
- 기기별 레이아웃: 데스크톱(≥1100px) 상단 메뉴 + 사진 340px · 태블릿(700–1099px) Menu 시트 + 사진 240px · 휴대폰(<700px) 1단, 논문 썸네일 숨김

### 사이트 구성

```
메인 페이지 (index.html)
    │
    ├─ Introduction (사진 · 소개 · 실적 수 · 링크)
    ├─ Research ─ Journal · Conference · Patent · International Standard · Project (각 선정 3건)
    ├─ Education / Activities / Honors & Awards / Beyond Research
    │
    └─ "전체 0N건 보기" · Research 드롭다운의 "전체 목록 · Knowledge Graph"
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
├── index.html          메인 페이지 (Introduction → Research → Education → Activities → Awards → Beyond)
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
Knowledge Graph가 모두 자동 갱신**됩니다.

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
| `selected` | `true`면 메인 페이지에 노출 (카테고리별 최대 3건, 최신순). 없거나 `false`면 전체 목록에만 표시 |
| `title`   | 제목                                                                  |
| `authors` | 저자 배열. 본인(`Hyoseung Shin`/`신효승`)은 그래프 중심 `Me` 노드, 나머지는 공동연구자 노드 자동 생성 |
| `venue`   | 저널/학회 전체 명칭 (축약 없이)                                                  |
| `year`    | 연도 — 날짜 열 표시와 최신순 정렬에 사용                                         |
| `image`   | 저널 카드 썸네일 (선택)                                                      |
| `links`   | `[ { "name": "...", "url": "..." } ]` 링크 버튼 배열                      |

**링크 버튼 규칙**

| 카테고리                            | 버튼                                  |
| ------------------------------- | ----------------------------------- |
| Journal                         | `code` · `paper` · `poster` (전체 표시) |
| Conference · Patent · Standard · Project | 관련 문서 PDF 버튼 1개                      |

> URL이 `./404NotFound` 또는 `to.be.continue`처럼 준비되지 않은 경우, 해당 버튼은 화면에 나타나지 않습니다.
> 실제 URL로 바꾸면 자동으로 표시됩니다.

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

## 🎨 커스터마이징

### 색상 (다크/라이트)

`styles.css`의 `:root[data-theme="..."]`에서 테마 변수를 수정합니다.

```css
:root[data-theme="light"]{
    --paper:#ffffff;   /* 페이지 배경 */
    --panel:#f2f4f7;   /* 면: 드롭다운 · 실적 수 타일 · 알약 버튼 · 그래프 영역 */
    --panel-2:#e6eaf0; /* 면 hover */
    --ink:#12161c;     /* 본문 텍스트 · 현재 섹션 표시 */
    --ink-2:#4a515c;   /* 보조 텍스트 */
    --ink-3:#656c78;   /* 메타 텍스트 (흰 배경 대비 5.3:1) */
    --accent:#003876;  /* 연세·VISCOM 블루: 섹션 라벨 · Int./국내 표시 · 사진 아래 디코딩 막대 · 모자이크의 한 칸 */
}
```

`--paper`, `--ink*`, `--rule*`, `--panel`과 `.tbtn`은 `graduate_plan.html`도 함께 쓰므로 이름을 바꾸지 마세요.
사진 디코딩 단계(블록 크기 · 휘도 전용 단계 · 간격)는 `app.js`의 `decodePortrait`에서 조정합니다.

### 폰트

`styles.css`의 `:root`에서 폰트 변수를 수정합니다.

```css
:root{
    --font:'Pretendard','Apple SD Gothic Neo','Helvetica Neue',Arial,system-ui,sans-serif;
}
```

### 페이지 연결

- 메인 → 리서치: Research 드롭다운의 **전체 목록 · Knowledge Graph** / 각 카테고리의 **전체 0N건 보기**
- 리서치 → 메인: 상단 바의 이름 / **← Home**

---

## 📱 반응형 디자인

| 브레이크포인트   | 동작                                              |
| --------- | ----------------------------------------------- |
| `≤ 1099px` | 상단 메뉴 → Menu 시트, 사진 240px, 논문 썸네일 220px |
| `≤ 699px`  | 사진이 이름 위로, 실적 수 타일 2×2, 논문 썸네일 숨김, 본문 16px |

---

## 🐛 문제 해결

| 증상                     | 점검 사항                                                  |
| ---------------------- | ------------------------------------------------------ |
| 데이터가 안 보임 / 빈 화면       | `file://` 대신 HTTP 서버로 실행 · JSON 문법(쉼표·따옴표) · 경로 확인     |
| 그래프가 안 보임              | D3.js(CDN) 로드 · `research.json` 데이터 유무 · `id` 중복 확인     |
| 스타일이 안 먹힘              | `styles.css` 경로 · 브라우저 캐시 삭제(`Ctrl+Shift+R`)           |
| 일부 링크 버튼이 안 보임        | URL이 `404NotFound`/`to.be.continue` — 실제 URL로 교체 시 표시 |

---

## 📝 라이선스

본 저장소는 **신효승(Hyoseung Shin)** 의 개인 학술 포트폴리오입니다. 사이트 콘텐츠(논문/이력/이미지 등)의
무단 복제·재배포를 제한합니다. 코드 구조는 참고용으로 활용하실 수 있습니다.

---

<div align="center">

🔗 [hyoseung-shin.github.io](https://hyoseung-shin.github.io) · Yonsei University

</div>
