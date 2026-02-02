# Web App 화면 구성도

 **요즘 SaaS·대시보드형 앱웹에서 많이 쓰는 패턴**을 기준으로, 기존 구조를 **반응형(App-Web 공용) UI/UX**  입니다.


# 1. 전체 화면 구조 (Responsive App-Web)


[ App Shell ]
- Top Bar (항상 표시, Sticky)
  -  Navigation (Context-aware)
  -  Desktop: Sidebar (Collapsible)
  ─ Mobile: Bottom Tab / Drawer
  ─ Main Canvas (Content Area)


### 핵심 UX 원칙

* **Today = 홈(Home)** 개념
* 페이지 이동 최소화 → **상태 전환 / 섹션 확장 중심**
* Desktop ↔ Mobile 간 **정보 구조 동일**, 표현만 변경

---

# 2. Top Bar (Header → Top Bar로 재정의)

### 구성 요소 (좌 → 우)

[ Logo ]  Today · 2026.02.02    [ Profile ]

### 상세

* **좌측**

  * 서비스 로고 (클릭 시 Today로 이동)
* **중앙**

  * 현재 날짜 (Today 강조)
* **우측**

  * * Quick Action (추가, 기록, 빠른 입력)
  * 🌙 다크/라이트 토글
  * 프로필 메뉴 (Avatar)

### UX 설계 포인트

* Height: **56px (모바일 기준)**
* 항상 Sticky
* 스크롤 시 그림자만 표시 (시야 방해 최소화)
* 텍스트보다 **아이콘 우선**

---

# 3. Navigation 구조 (반응형 핵심)

## 3.1 Desktop / Tablet (≥ 1024px)

### Collapsible Sidebar

```text
[ Sidebar ]
🏠 Today
📆 History
📊 Reports
⚙️ Settings
```

#### 특징

* 기본: **아이콘 + 텍스트**
* 축소 시: **아이콘 only**
* Hover 시 툴팁 표시
* Today는 항상 강조 (accent color)

---

## 3.2 Mobile / Small Tablet (≤ 1023px)

### Bottom Navigation (요즘 앱웹 표준)

```text
[ Today ] [ History ] [ + ] [ Reports ] [ Settings ]
```

#### 설계 이유

* 엄지 접근성 최적화
* Drawer 대비 진입 비용 낮음
* Today 중심 사용 흐름 유지

> 설정·부가 기능이 많아질 경우
> → Settings만 Drawer로 분리 가능

---

# 4. Main Content (중앙 캔버스)

## 4.1 Today / Daily Dashboard (Home)

```text
[ Today ]
 ├─ Summary Cards (상단)
 ├─ Main Timeline / To-Do
 └─ Context Panels (접힘/펼침)
```

### UX 포인트

* **스크롤 1페이지 안에 핵심 정보**
* 카드 기반 레이아웃
* 섹션 간 이동 없이 펼침/접힘

---

## 4.2 History / Reports

* Today와 **동일한 레이아웃 구조**
* 상단에 날짜 필터 / 기간 선택
* 메인 캔버스만 내용 교체

---

# 5. 전반적인 UI 트렌드 반영 요소

### 레이아웃

* Card 기반
* 8px Grid 시스템
* 여백 넉넉하게 (정보 밀도 조절)

### 인터랙션

* Page Transition ❌
* **State Transition ⭕**

  * Modal
  * Slide Panel
  * Inline Expand

### 색상 & 테마

* Neutral Base + Accent 1개
* 다크 모드 기본 지원
* 상태 색상 최소화 (경고/완료만)

---

# 6. 요약 (기존 대비 변경점)

| 항목      | 기존      | 개선                               |
| ------- | ------- | -------------------------------- |
| Header  | 단순 상단   | Top Bar + Quick Action           |
| Sidebar | 고정      | Desktop: 접힘 / Mobile: Bottom Tab |
| Today   | 메뉴 중 하나 | **앱의 Home / 중심**                 |
| 화면 이동   | 페이지 중심  | **맥락 유지 중심**                     |
| 모바일     | 축소판     | **모바일 퍼스트 설계**                   |

---
