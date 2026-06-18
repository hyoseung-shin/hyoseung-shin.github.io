<div align="center">

# 🎓 Hyoseung Shin — Academic Portfolio

### 영상 코딩 표준(VVC/VCM) 연구 포트폴리오 & 인터랙티브 Paper Analysis 대시보드

GitHub Pages · Tailwind CSS · Vanilla JS · Chart.js · D3.js

<p>
<img src="https://img.shields.io/badge/Live-hyoseung--shin.github.io-2c3e50"/>
<img src="https://img.shields.io/badge/GitHub%20Pages-deployed-222"/>
<img src="https://img.shields.io/badge/HTML-Tailwind%20CSS-38BDF8"/>
<img src="https://img.shields.io/badge/Charts-Chart.js%20%7C%20D3.js-FF6384"/>
<img src="https://img.shields.io/badge/Responsive-Mobile%20%7C%20Desktop-success"/>
</p>

🔗 **[https://hyoseung-shin.github.io](https://hyoseung-shin.github.io)**

</div>

---

## 🏆 핵심 요약

| 항목 | 내용 |
|------|------|
| 유형 | 개인 학술 포트폴리오 + 인터랙티브 연구 분석 대시보드 |
| 배포 | GitHub Pages (`username.github.io`) |
| 메인 페이지 | About · Research(Journal/Conference/Patent/Standard/Project) · Education · Awards · Activities |
| 대시보드 | 논문/표준 통계 차트(Chart.js) + Co-authorship 그래프(D3.js) |
| 기술 | HTML5 · Tailwind CSS(CDN) · Vanilla JavaScript · Pretendard · Font Awesome |
| 반응형 | 모바일 · 태블릿 · 데스크톱 최적화 |
| 빌드 | 무빌드(no build step) — 정적 파일만으로 동작 |

---

## 🚀 프로젝트 소개

영상 코딩·압축 표준(**VVC / VCM**) 분야 연구자 **신효승(Hyoseung Shin)** 의 학술 포트폴리오 웹사이트입니다.
논문·특허·국제 표준 기여·프로젝트 등 연구 활동을 한 페이지에 정리한 **메인 포트폴리오**와, 연구 실적을
시각적으로 탐색할 수 있는 **Paper Analysis 대시보드**(차트 + 공동 저자 네트워크 그래프)로 구성됩니다.

별도의 빌드 과정 없이 정적 파일만으로 동작하며, GitHub Pages에 그대로 배포됩니다.

### 주요 특징

- 단일 페이지 포트폴리오 — 부드러운 스크롤 네비게이션과 Research 드롭다운 메뉴
- Chart.js 기반 연구 실적 통계 시각화 (연도별 논문 수, 국제/국내, 저널/컨퍼런스 등)
- D3.js 기반 인터랙티브 **Co-authorship Graph** (공동 저자 네트워크)
- 데이터(JSON)와 표현(HTML/CSS)을 분리해 손쉬운 콘텐츠 갱신
- Glassmorphism 네비게이션, 반응형 레이아웃, 모바일 메뉴

### 사이트 구성

```text
메인 포트폴리오 (index.html)
    │
    ├─ About / Education / Honors & Awards / Activities
    ├─ Research ─ Journal · Conference · Patent · International Standard · Project
    │
    └─ "📊 View More Research"
            ↓
Paper Analysis 대시보드 (paper-analysis/index.html)
    ├─ 연구 실적 통계 차트 (Chart.js)
    └─ Co-authorship Graph (D3.js)
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

> ⚠️ 파일을 직접 더블클릭(`file://`)하면 일부 브라우저에서 `fetch`로 불러오는 JSON 데이터가
> 차단될 수 있으므로, 로컬에서도 HTTP 서버로 여는 것을 권장합니다.

---

## 🏗️ 프로젝트 구조

```text
hyoseung-shin.github.io/
├── index.html                    메인 포트폴리오 페이지 (Tailwind + Vanilla JS)
├── paper-analysis/               Paper Analysis 대시보드
│   ├── index.html                대시보드 페이지
│   ├── style.css                 대시보드 스타일
│   ├── script.js                 차트 정의 및 렌더링
│   ├── data/
│   │   └── coauthor-data.json    Co-authorship 그래프 데이터(nodes/links)
│   └── assets/                   추가 리소스
│
├── avatar/                       프로필 이미지 및 PDF
├── journal/                      저널 논문 자료
├── conference/                   컨퍼런스 자료
├── awards/                       수상 증명서
├── pro_act/                      활동 증명서
├── projects/                     프로젝트 자료
├── INTEGRATION_GUIDE.md          통합/배치 가이드
└── README.md                     이 파일
```

---

## 📊 대시보드 콘텐츠 관리

### 1. Co-authorship Graph (D3.js)

`paper-analysis/data/coauthor-data.json`을 수정하여 공동 저자 네트워크를 관리합니다.

```json
{
  "nodes": [
    { "id": "이름", "group": 1, "role": "역할", "color": "#색상코드" }
  ],
  "links": [
    { "source": "저자1", "target": "저자2", "value": 1 }
  ]
}
```

| 속성 | 설명 |
|------|------|
| `id` | 저자 이름 |
| `group` | 시각화용 그룹 번호 |
| `role` | `Professor` · `Ph.D. Student` · `MS Student` · `Undergraduate` · `Me` |
| `color` | 노드 색상(16진수) |
| `value` | 링크(공동 저술) 연결 강도 (1–5) |

### 2. 통계 차트 (Chart.js)

`paper-analysis/script.js`에서 각 차트 데이터를 수정합니다.

| 차트 | 데이터 예시 |
|------|------------|
| Papers per Year | `data: [2, 5, 4, 1]` (연도별 논문 수) |
| Int'l vs Domestic | `International [0,1,2,0]` / `Domestic [2,4,2,1]` |
| Journal vs Conference | `data: [4, 8]` |
| Contribution per Year | `data: [1, 2, 3, 1]` (연도별 표준 기여도) |
| VVC vs VCM | `data: [4, 3]` |

---

## 🎨 커스터마이징

### 색상 (대시보드)

`paper-analysis/style.css`의 `:root`에서 색상 변수를 수정합니다.

```css
:root {
    --primary-color: #2c3e50;   /* 주 색상 */
    --accent-color:  #3498db;   /* 강조 색상 */
    --bg-color:      #f8f9fa;   /* 배경 */
    --card-bg:       #ffffff;   /* 카드 배경 */
    --text-main:     #333333;   /* 본문 텍스트 */
    --text-muted:    #7f8c8d;   /* 보조 텍스트 */
}
```

### 네비게이션 연결

- 포트폴리오 → 대시보드: Research 드롭다운의 **📊 View More Research**
- 대시보드 → 포트폴리오: 헤더 로고 / 네비게이션 / 푸터의 **← Back to Research**

---

## 🐛 문제 해결

| 증상 | 점검 사항 |
|------|----------|
| 그래프가 안 보임 | 콘솔(F12) 에러 확인 · Chart.js/D3.js 로드 여부 · JSON 형식 검증 |
| 스타일이 안 먹힘 | `style.css` 경로 · 브라우저 캐시 삭제(`Ctrl+Shift+R`) |
| 네비게이션 작동 안 함 | 상대 경로 · 폴더 구조 · 파일명 대소문자 확인 |

---

## 📝 라이선스

본 저장소는 **신효승(Hyoseung Shin)** 의 개인 학술 포트폴리오입니다. 사이트 콘텐츠(논문/이력/이미지 등)의
무단 복제·재배포를 제한합니다. 코드 구조를 참고용으로 활용하실 수 있습니다.

---

<div align="center">

🔗 [hyoseung-shin.github.io](https://hyoseung-shin.github.io) · Yonsei University

</div>
