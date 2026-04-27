# 포트폴리오 & Paper Analysis 통합 가이드

## 📋 개요

이 프로젝트는 신효승 님의 포트폴리오 웹사이트와 Paper Analysis 대시보드를 완벽하게 통합한 패키지입니다.

## 🎯 주요 기능

### 1. 포트폴리오 페이지 (`index-portfolio.html`)
- 기존 포트폴리오 디자인 유지
- Research 드롭다운 메뉴에 "📊 View More Research" 버튼 추가
- 모든 섹션(About, Research, Education, Awards, Activities, Others) 포함

### 2. Paper Analysis 대시보드 (`paper-analysis/index.html`)
- **Publication Analytics**: Papers per Year, Int'l vs Domestic, Journal vs Conference
- **Standard Contributions**: Contribution per Year, VVC vs VCM
- **Co-authorship Graph**: 인터랙티브 네트워크 그래프 (D3.js)
- **역동적 제어**: 그래프 설정 슬라이더, 역할 필터 체크박스

## 📁 파일 구조

```
portfolio/
├── index-portfolio.html              # 메인 포트폴리오 페이지
├── paper-analysis/                   # Paper Analysis 서브디렉토리
│   ├── index.html                   # 대시보드 메인 페이지
│   ├── style.css                    # 대시보드 스타일
│   ├── script.js                    # 대시보드 JavaScript (Chart.js + D3.js)
│   ├── data/
│   │   └── coauthor-data.json       # 공동 저자 그래프 데이터
│   └── assets/                      # 추가 리소스 폴더
├── avatar/                           # 프로필 이미지 및 PDF
├── journal/                          # 저널 논문 자료
├── conference/                       # 컨퍼런스 자료
├── awards/                           # 수상 증명서
├── pro_act/                          # 활동 증명서
└── projects/                         # 프로젝트 자료
```

## 🚀 설치 및 배포 방법

### Step 1: 파일 배치
1. `index-portfolio.html`을 포트폴리오 루트 디렉토리에 배치
2. `paper-analysis/` 폴더 전체를 포트폴리오 루트 디렉토리에 배치

### Step 2: 기존 파일 통합
기존 포트폴리오 HTML 파일이 있다면:
1. 기존 파일을 `index-portfolio.html`로 이름 변경
2. 기존 파일의 Research 섹션 끝에 다음 버튼 추가:
```html
<a href="./paper-analysis/index.html" class="view-more-btn">
    📊 View More Research →
</a>
```

### Step 3: 로컬 테스트
```bash
cd /path/to/portfolio
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 🔧 커스터마이징 가이드

### Co-authorship Graph 데이터 수정

`paper-analysis/data/coauthor-data.json` 파일을 편집합니다:

```json
{
  "nodes": [
    {
      "id": "저자이름",
      "group": 1,
      "role": "역할 (Professor/Ph.D. Student/MS Student/Undergraduate/Me)",
      "color": "#16진수색상코드"
    }
  ],
  "links": [
    {
      "source": "저자1",
      "target": "저자2",
      "value": 연결강도(1-5)
    }
  ]
}
```

**역할별 권장 색상:**
- Me: `#e74c3c` (빨강)
- Professor: `#2c3e50` (진회색)
- Ph.D. Student: `#3498db` (파랑)
- MS Student: `#2ecc71` (초록)
- Undergraduate: `#f39c12` (주황)

### 차트 데이터 수정

`paper-analysis/script.js` 파일의 다음 섹션을 수정합니다:

#### Papers per Year
```javascript
labels: ['2023', '2024', '2025', '2026'],
data: [2, 5, 4, 1],  // 각 연도별 논문 수
```

#### Int'l vs Domestic
```javascript
datasets: [
    { label: 'International', data: [0, 1, 2, 0], ... },
    { label: 'Domestic', data: [2, 4, 2, 1], ... }
]
```

#### Journal vs Conference
```javascript
data: [4, 8],  // [Journal, Conference]
```

#### Contribution per Year
```javascript
data: [1, 2, 3, 1],  // 각 연도별 표준 기여도
```

#### VVC vs VCM
```javascript
data: [4, 3],  // [VVC, VCM]
```

### 색상 및 스타일 커스터마이징

`paper-analysis/style.css`에서 다음 변수를 수정합니다:

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

## 🎮 Co-authorship Graph 제어

### GRAPH SETTINGS
- **Repulsion (Push)**: 노드 간 반발력 조절 (100-1000)
  - 낮을수록 노드가 가까워짐
  - 높을수록 노드가 멀어짐
  
- **Gravity (Pull)**: 중심으로의 인력 조절 (0-1)
  - 낮을수록 자유로운 배치
  - 높을수록 중심에 집중
  
- **Edge Length**: 연결선 길이 조절 (50-500)
  - 낮을수록 촘촘함
  - 높을수록 넓게 퍼짐

### SHOW ROLES
체크박스를 통해 특정 역할의 노드만 표시/숨김 가능

### Reset View
모든 설정을 기본값으로 초기화

## 🔗 네비게이션 흐름

### 포트폴리오 → Paper Analysis
1. 포트폴리오의 Research 드롭다운 메뉴 클릭
2. "📊 View More Research" 버튼 클릭
3. Paper Analysis 대시보드로 이동

### Paper Analysis → 포트폴리오
1. 헤더의 "Hyo-seung" 로고 클릭
2. 헤더의 네비게이션 링크 클릭
3. 푸터의 "← Back to Research" 링크 클릭

## 📊 차트 라이브러리

- **Chart.js**: 막대 차트, 라인 차트, 도넛 차트
- **D3.js**: 인터랙티브 네트워크 그래프

## 🌐 배포

### GitHub Pages 배포
```bash
# 저장소 루트에 파일 배치
git add .
git commit -m "Add Paper Analysis Dashboard"
git push origin main
```

### 일반 웹 호스팅
1. 모든 파일을 웹 서버에 업로드
2. `index-portfolio.html`이 메인 페이지가 되도록 설정
3. `paper-analysis/` 폴더가 올바른 위치에 있는지 확인

## 🐛 문제 해결

### 그래프가 표시되지 않을 때
1. 브라우저 콘솔 확인 (F12)
2. Chart.js, D3.js 라이브러리 로드 확인
3. `paper-analysis/script.js` 파일 경로 확인

### 네비게이션이 작동하지 않을 때
1. 상대 경로 확인 (`../` 사용)
2. 폴더 구조 재확인
3. 파일명 대소문자 확인 (Linux/Mac에서 중요)

### 스타일이 적용되지 않을 때
1. `style.css` 파일 경로 확인
2. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
3. 개발자 도구에서 CSS 로드 상태 확인

## 📝 라이선스

이 프로젝트는 신효승 님의 포트폴리오입니다.

## 📧 기술 지원

문제가 발생하거나 개선 사항이 있으면 연락주세요.

---

**마지막 업데이트**: 2026년 4월 27일
