# Paper Analysis Dashboard - 통합 프로젝트

신효승 님의 포트폴리오 웹사이트와 Paper Analysis 대시보드를 통합한 프로젝트입니다.

## 📁 프로젝트 구조

```
portfolio/
├── index-portfolio.html          # 메인 포트폴리오 페이지
├── paper-analysis/
│   ├── index.html               # Paper Analysis 대시보드
│   ├── style.css                # 대시보드 스타일
│   ├── script.js                # 대시보드 JavaScript
│   ├── data/
│   │   └── coauthor-data.json   # 공동 저자 그래프 데이터
│   └── assets/                  # 추가 리소스
├── avatar/                       # 프로필 이미지 및 PDF
├── journal/                      # 저널 논문 자료
├── conference/                   # 컨퍼런스 자료
├── awards/                       # 수상 증명서
├── pro_act/                      # 활동 증명서
└── projects/                     # 프로젝트 자료
```

## 🚀 사용 방법

### 1. 파일 배치
- `index-portfolio.html`을 포트폴리오 루트 디렉토리에 배치합니다.
- `paper-analysis/` 폴더 전체를 포트폴리오 루트 디렉토리 내에 배치합니다.

### 2. 기존 파일 통합
기존 포트폴리오 HTML 파일을 `index-portfolio.html`로 이름을 변경하고 배치하면 됩니다.

### 3. 로컬 테스트
```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 🔧 Co-authorship Graph 데이터 관리

### 데이터 수정 방법

`data/coauthor-data.json` 파일을 수정하여 공동 저자 정보를 관리합니다.

```json
{
  "nodes": [
    {
      "id": "이름",
      "group": 1,
      "role": "역할",
      "color": "#색상코드"
    }
  ],
  "links": [
    {
      "source": "저자1",
      "target": "저자2",
      "value": 연결강도
    }
  ]
}
```

**노드 속성:**
- `id`: 저자의 이름
- `group`: 그룹 번호 (시각화용)
- `role`: 역할 (Professor, Ph.D. Student, MS Student, Undergraduate, Me)
- `color`: 노드 색상 (16진수 색상코드)

**링크 속성:**
- `source`: 출발 저자
- `target`: 도착 저자
- `value`: 연결 강도 (1-5, 높을수록 강한 연결)

### 예시: 새로운 공동 저자 추가

```json
{
  "id": "New Author",
  "group": 3,
  "role": "Ph.D. Student",
  "color": "#3498db"
}
```

그리고 링크 추가:
```json
{
  "source": "Hyoseung Shin",
  "target": "New Author",
  "value": 3
}
```

## 📊 차트 데이터 수정

`script.js` 파일에서 각 차트의 데이터를 수정할 수 있습니다.

### Papers per Year
```javascript
data: [2, 5, 4, 1],  // 각 연도별 논문 수
```

### Int'l vs Domestic
```javascript
datasets: [
    { label: 'International', data: [0, 1, 2, 0], ... },
    { label: 'Domestic', data: [2, 4, 2, 1], ... }
]
```

### Journal vs Conference
```javascript
data: [4, 8],  // [Journal, Conference]
```

### Contribution per Year
```javascript
data: [1, 2, 3, 1],  // 각 연도별 표준 기여도
```

### VVC vs VCM
```javascript
data: [4, 3],  // [VVC, VCM]
```

## 🎨 디자인 커스터마이징

### 색상 변경
`style.css`의 `:root` 섹션에서 색상 변수를 수정합니다:

```css
:root {
    --primary-color: #2c3e50;      /* 주 색상 */
    --accent-color: #3498db;       /* 강조 색상 */
    --bg-color: #f8f9fa;           /* 배경 색상 */
    --card-bg: #ffffff;            /* 카드 배경 */
    --text-main: #333333;          /* 주 텍스트 */
    --text-muted: #7f8c8d;         /* 보조 텍스트 */
}
```

### 폰트 변경
`style.css`의 `body` 섹션에서 폰트를 수정합니다:

```css
body {
    font-family: 'Your Font', sans-serif;
}
```

## 🔗 네비게이션 링크

### 포트폴리오에서 Paper Analysis로
Research 드롭다운 메뉴에 "📊 View More Research" 버튼이 자동으로 추가됩니다.

### Paper Analysis에서 포트폴리오로
- 헤더의 "Hyo-seung" 로고 클릭
- 헤더의 네비게이션 링크 클릭
- 푸터의 "← Back to Research" 링크 클릭

## 📱 반응형 디자인

모든 페이지는 모바일, 태블릿, 데스크톱에 최적화되어 있습니다.

## 🐛 문제 해결

### 그래프가 표시되지 않을 때
1. 브라우저 콘솔에서 에러 확인 (F12)
2. Chart.js와 D3.js 라이브러리 로드 확인
3. 데이터 형식 검증

### 스타일이 적용되지 않을 때
1. `style.css` 파일 경로 확인
2. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
3. 개발자 도구에서 CSS 로드 상태 확인

### 네비게이션이 작동하지 않을 때
1. 파일 경로 확인 (상대 경로 사용)
2. 폴더 구조 재확인
3. 파일명 대소문자 확인

## 📝 라이선스

이 프로젝트는 신효승 님의 포트폴리오입니다.

## 📧 문의

문제가 발생하거나 개선 사항이 있으면 연락주세요.
