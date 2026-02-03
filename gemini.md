# 웹·앱 통합 서비스 기획서
## 서비스명(가칭): Life Asset Planner

---

## 1. 기획 배경 및 문제 정의

### 1.1 기획 배경
현대 개인 사용자는 다음과 같은 영역을 각각 다른 서비스로 관리하고 있다.

- To-Do / 일정 관리
- 수입·지출 가계부
- 환율 계산
- 주식 투자 기록 (국내 / 미국)

이로 인해 **일상 행동, 소비, 투자 판단이 하나의 흐름으로 연결되지 못하고 단절**된다.

---

# 웹·앱 통합 서비스 기획서
## 서비스명(가칭): Life Asset Planner

---

## 1. 기획 배경 및 문제 정의

### 1.1 기획 배경
현대 개인 사용자는 다음과 같은 영역을 각각 다른 서비스로 관리하고 있다.

- To-Do / 일정 관리
- 수입·지출 가계부
- 환율 계산
- 주식 투자 기록 (국내 / 미국)

이로 인해 **일상 행동, 소비, 투자 판단이 하나의 흐름으로 연결되지 못하고 단절**된다.

---

### 1.2 문제 정의
> “오늘 무엇을 했고,  
> 얼마를 벌고 쓰고,  
> 어떤 투자 판단을 했는지를  
> 하나의 기록으로 남기기 어렵다.”

Life Asset Planner는  
**하루 단위 기록을 중심으로 일상 + 자산 + 투자 판단을 통합 관리**하는 것을 목표로 한다.

---

## 2. 서비스 한 줄 정의 (Value Proposition)

**Life Asset Planner는**  
할 일, 수입·지출, 환율, 주식 투자 기록을  
웹과 모바일 앱에서 동일하게 관리하는  
개인 라이프 & 자산 통합 관리 서비스이다.

---

## 3. 서비스 범위 및 플랫폼 전략

### 3.1 플랫폼 구성
- **Web**: Next.js 기반 웹 서비스
- **Mobile App**: React Native (Expo) 기반 앱
- **Backend / DB**: Supabase (PostgreSQL + Auth)

> 웹과 앱은 **동일한 데이터베이스와 인증 시스템**을 사용한다.

---

## 4. 핵심 기능 (MVP)

---

### 4.1 Daily Dashboard (하루 단위 핵심 개념)

모든 데이터는 **Daily Page**를 기준으로 관리된다.

- 날짜 기준 자동 생성
- 하루의 행동 + 자산 흐름 + 투자 판단을 하나로 묶음

---

### 4.2 To-Do 리스트

- 하루 단위 할 일 관리
- 상태: 대기 / 진행 / 완료
- 중요도 설정
- 할 일별 메모 (의도 및 배경 기록)

---

### 4.3 수입 · 지출 관리 (KRW / USD)

하루 단위로 발생한 **모든 금전 흐름을 기록**한다.  
가계부가 아니라 **의사결정 기록**에 초점을 둔다.

#### 수입 관리
- 금액 입력
- 통화 선택: KRW / USD
- 수입 유형
  - 급여
  - 부수입
  - 투자 수익
  - 기타
- 메모 (수입 발생 배경 기록)

#### 지출 관리
- 금액 입력
- 통화 선택: KRW / USD
- 카테고리
  - 식비 / 교통 / 구독 / 쇼핑 / 생활비 / 기타
- 지출 유형
  - 고정 지출
  - 변동 지출
- 메모 (소비 이유, 감정, 필요성 기록)

> 숫자보다 “왜 이 지출이 발생했는지”를 함께 남기는 것을 원칙으로 한다.

---

### 4.4 환율 관리 및 계산

환율은 **계산 도구가 아닌 기록의 기준 정보**로 사용된다.

- 기준 통화: KRW
- 지원 통화: USD (MVP)
- 기능
  - 실시간 환율 조회
  - 수입/지출 입력 시 자동 환산
  - 기록 시점 환율 저장

> 과거 데이터는 항상 **기록 당시 환율 기준으로 고정**한다.  
> 환율 변동으로 과거 기록이 왜곡되지 않도록 한다.

---

### 4.5 주식 투자 기록 관리 (국내 / 미국)

투자 기록은 “수익률 관리”가 아니라  
**판단의 히스토리**를 남기는 데 목적이 있다.

#### 투자 대상
- 국내 주식 (KOSPI / KOSDAQ)
- 미국 주식 (NYSE / NASDAQ)

#### 기록 항목
- 종목명 / 티커
- 매수 / 매도 구분
- 수량
- 체결 가격
- 통화 (KRW / USD)
- 거래 날짜
- 투자 메모
  - 매수 이유
  - 매도 판단 근거
  - 당시 시장 상황

#### 관리 기준
- 실현 손익 / 미실현 손익 분리
- 수익률보다 **판단 메모를 우선 노출**
- 종목별 히스토리 누적 관리

---

### 4.6 Daily Page 회고 (Optional)

하루의 기록을 마무리하며 간단한 회고를 남긴다.

- 오늘 잘한 판단
- 아쉬웠던 선택
- 다음에 개선할 점

> 강제하지 않으며,  
> **부담 없이 남길 수 있는 수준**을 유지한다.

---

### 4.7 누적 리포트 (주간 / 월간)

Daily Page 데이터는 자동으로 누적된다.

#### 제공 정보
- 기간별 총 수입 / 총 지출
- 통화별 자산 흐름
- 지출 카테고리 비중
- 투자 기록 요약

#### 설계 원칙
- 분석보다 **회고에 도움 되는 형태**
- 그래프보다 **맥락 파악 우선**

---

### 4.8 Daily Page 중심 설계 원칙

- 모든 데이터는 날짜(Daily Page)에 귀속
- 삭제보다 기록 유지
- 숫자보다 맥락
- 단기 성과보다 장기 흐름

> “하루의 선택이 쌓여 나의 기준이 된다”는 철학을 유지한다.

### 5. 기술 스택 

### 5.1 Frontend (Web)

- **Next.js (React)**
- TypeScript
- Tailwind CSS
- 배포: **Vercel**

---

### 5.2 Frontend (Mobile App)

- **React Native**
- **Expo Go**
- Web과 UI/로직 최대한 공유
- OTA 업데이트 활용

---

### 5.3 Backend / Database

- **Supabase**
  - PostgreSQL
  - Row Level Security (RLS)
- **Supabase Auth**
  - Email / OAuth 로그인
  - Web & App 통합 인증

---

### 5.4 개발 및 협업

- GitHub (형상 관리)
- GitHub Actions (CI)
- Vercel + Supabase 연동 배포

---

## 6. Gemini Agent 기반 개발 전략

### 6.1 개발 방식
- Gemini Agent를 **풀스택 개발 보조 AI**로 활용
- 사용 영역
  - DB 스키마 설계
  - Supabase RLS 정책 생성
  - API 로직 설계
  - React / React Native 컴포넌트 생성
  - 리팩토링 및 테스트 보조

### 6.2 개발 목표
- 혼자서도 **풀스택 서비스 완성**
- 실제 운영 가능한 구조
- 포트폴리오 + 실사용 서비스 겸용

---

## 7. 데이터 구조 (개념)

- User (Supabase Auth)
- DailyPage
- Todo
- Income
- Expense
- ExchangeRate
- StockTrade
- InvestmentMemo

> 모든 데이터는 User + DailyPage 기준으로 연결

## 7. 디자인 및 UI/UX 설계 (Vibe 기반 통합 가이드)

이 섹션은 UXSnaps의 'Vibe' 코딩 인터페이스에서 얻은 디자인 방향성을 이 프로젝트에 맞게 통합한 가이드입니다. 핵심은 "심도 있는 카드, 부드러운 인터랙션, 명확한 토큰화"입니다.

### 7.1 핵심 원칙
- Today 중심: `Today` 뷰를 홈으로 삼아 모든 흐름의 시작점으로 유지합니다.
- 일관된 구조: Desktop↔Mobile은 정보 구조를 동일하게 유지하되 표현을 최적화합니다.
- 상태 전환 우선: 전체 페이지 이동 대신 모달·슬라이드·인라인 확장으로 맥락 유지.
- 미세한 모션: 빠르고 경쾌한 트랜지션(100–200ms), `prefers-reduced-motion` 고려.

### 7.2 한국형 UI/UX 추가 지침

최근 대한민국에서 많이 채택되는 UI/UX 트렌드를 반영한 추가 지침입니다. 모바일 퍼스트, 엄지 조작성, 간결한 정보 계층, 강한 액션 컬러를 우선으로 합니다.

- 타이포그래피: `Noto Sans KR` 계열 권장 — 한글 가독성을 최우선으로 합니다. 본 프로젝트는 `Noto_Sans_KR`를 기본 폰트로 사용합니다.
- 레이아웃 밀도: 모바일 중심으로 compact하지만, 정보 key는 크게 강조합니다. 리스트 항목은 56px 또는 64px 높이(터치 타깃 권장)로 유지하세요.
- 네비게이션: 하단 탭 + 중앙 FAB(빠른 입력) 패턴 권장 — 주요 액션은 중앙 FAB로 노출합니다.
- 액션 컬러: 브랜드 액센트 컬러(Primary)를 버튼과 FAB에 사용하고, 보조 액션은 muted 톤으로 처리합니다.
- 카드/리스트: 카드의 모서리는 부드러운 반경(8–12px), 그림자 최소화로 평면감 유지. 상세는 토글로 노출.
- 입력 폼: 큰 입력 필드(높이 44px 이상), 라벨은 간결하게, 화폐/단위는 입력 옆에 명시.
- 정보 우선순위: 하루의 핵심 수치(오늘의 수입/지출/포트폴리오 변동)는 상단 Summary 카드에 노출하고, 상세 리스트는 접힘으로 제공.
- 언어/형식: 한국 사용자에게 자연스러운 날짜/통화 표기(YYYY.MM.DD, ₩) 사용.

### 7.3 화면별 권장 구성 (Korean pattern)

- 첫 화면(홈 / Today):
  - 상단: TopBar (로고 좌측, 중앙 날짜 강조, 우측 FAB/프로필)
  - 요약 카드: 오늘의 총수입, 총지출, 잔액(큰 숫자)
  - 주요 액션: '+' FAB로 빠른 입력(수입/지출/주식 기록)
  - 리스트: To-Do, 최근 거래, 투자인사이트(간결한 라인 아이템)

- 두번째 화면(Stocks / 보유종목):
  - 상단: 보유 총량/평가손익 요약
  - 보유 종목 리스트: 각 행에서 `티커 / 수량 / 현재가 / 일중변동(%) / H/L`을 보여줍니다.
  - 종목 상세: 모달 또는 우측 슬라이드패널로 투자 메모/거래내역 확인

- 세번째 화면(Memo):
  - 일별 회고 및 자유 메모
  - Tag 또는 카테고리로 필터링 가능 (예: 판단, 감정, 회고)

### 7.4 구현 우선순위 (권장)
- 우선: 모바일 뷰 우선 적용, 핵심 액션(빠른 입력 FAB), 요약 카드 구현
- 다음: 보유 종목 리스트와 현재가 확인(서버 프록시 사용), 메모 작성/검색
- 이후: 리포트와 기간별 집계, 리액티브 알림

---

### 7.2 디자인 토큰 (권장 CSS 변수 및 예시)
- 색상
  - `--color-bg` : #0f1720 (dark) / #f7fafc (light)
  - `--color-surface` : #0b1220 (dark) / #ffffff (light)
  - `--color-muted` : #94a3b8
  - `--color-accent` : #7c5cff
  - `--color-success` : #10b981
  - `--color-warning` : #f59e0b
  - `--color-danger` : #ef4444
- 타이포그래피
  - `--font-sans` (Geist / system) — 폰트 변수는 `src/app/layout.tsx`에서 설정됨
  - Scale: 14 (base), 16 (body), 20 (h4), 24 (h3), 32 (h2), 40 (h1)
- 레이아웃
  - Base spacing: 8px 그리드
  - Border radius: 8px (cards), 9999px (pill buttons)
  - Elevation: surface shadow `0 6px 18px rgba(12,18,30,0.18)` (desktop)

### 7.3 주요 컴포넌트 규격
- TopBar
  - Height: 56px (mobile 기준)
  - Sticky, 스크롤 시 subtle shadow
  - 구성: Left logo, Center 날짜, Right quick actions + theme toggle + profile
- Sidebar (Desktop)
  - Expanded width: 260px, Collapsed width: 72px
  - Item: icon + label (collapsed: icon only, tooltip on hover)
- Bottom Navigation (Mobile)
  - Height: 64px, 중앙에 prominent `+` action (FAB 스타일)
- Card
  - Padding: 16px (sm) / 24px (lg), border-radius: 12px
  - Background: `--color-surface`, subtle shadow
- Buttons
  - Primary: background `--color-accent`, white text, 12px vertical padding
  - Ghost: transparent bg, muted text, subtle hover surface
- Inputs
  - Height: 44px, border-radius: 8px, focus ring `--color-accent` (2px)

### 7.4 모션 & 인터랙션
- Transition durations: 120ms (hover), 160ms (slide/expand), easing: cubic-bezier(0.2,0.8,0.2,1)
- Hover: translateY(-2px) + shadow lift for actionable cards
- Focus: 2px outline with `--color-accent` (accessible contrast)
- Reduced motion: respect `prefers-reduced-motion` (no translate, instant toggles)

### 7.5 접근성
- 컬러 대비: 텍스트 대비 최소 4.5:1 권장
- 키보드 내비게이션: TopBar quick actions, sidebar items, floating action 버튼에 포커스 스타일 제공
- ARIA: 모달, 알림, 토스트는 적절한 ARIA 역할 및 live regions 사용

### 7.6 Tailwind (권장 확장 예시)
Tailwind 설정에 디자인 토큰을 맵핑하면 일관성 유지가 쉬워집니다. 예시(간단):

```js
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)'
      },
      spacing: { 18: '4.5rem' }
    }
  }
}
```

## Recent Repo Changes (2026-02-03)

- Home / `Today` simplified: now renders only the `TodoList` (daily task focus).
- `Money` consolidated: finance UI is canonical; stock-related UI was removed from the Money page.
- Legacy routes: `/finance` and `/stocks` redirect to `/money` (kept as short redirects).
- `Memo` screen was integrated into Today and the separate `memo` page removed from the main navigation.
- Dev note: resolved a JS/TS parse error in `src/app/page.tsx` that caused `/` to return 500 during development.

These changes aim to keep "Today" strictly task-focused and "Money" strictly finance-focused, removing duplicate screens and simplifying navigation.

### 7.7 구현 팁 (프로젝트 맥락)
- `src/app/layout.tsx`가 전역 폰트·토큰을 설정하므로 여기서 토큰 변수를 주입하세요.
- Tailwind 유틸을 기본으로 사용하되, 복잡한 컴포넌트는 재사용 컴포넌트로 분리 (`src/components/*`).
- Supabase 관련 UI(로그인, 세션 토스트)는 `src/middleware.ts`와 `src/lib/supabase/client.ts`의 세션 모델을 반영해 동작하도록 구현하세요.

### 7.8 예시: Today 카드 레이아웃 (구성)
- 상단: Summary Cards (수입/지출, 잔액)
- 중단: To-Do 타임라인 (우선순위, 상태 토글)
- 하단: Context Panel (접힘/펼침 가능한 메모, 투자 메모)

### 7.9 디자인 검사 체크리스트 (PR 템플릿 권장)
- 레이아웃: 8px 그리드 준수
- 토큰: 색상/간격/타입 변수가 사용되었는가
- 접근성: 키보드/콘트라스트/ARIA 확인
- 모션: `prefers-reduced-motion` 고려

---

## 8. MVP 개발 로드맵 (예시)

### 1단계 (주 1~2)
- 인증 (Supabase Auth)
- Daily Page 구조
- To-Do CRUD

### 2단계 (주 3~4)
- 수입 / 지출 관리
- 환율 적용
- 기본 리포트

### 3단계 (주 5~6)
- 투자 기록 관리
- 웹 UI 안정화
- Expo 앱 연결

---

## 9. 확장 아이디어 (v2 이후)

- AI 기반 월간 자산 요약
- 투자 성향 분석
- 다중 통화 지원
- PDF 리포트 생성
- 알림 기반 루틴 관리

---

## 10. 서비스 요약 문구

> “Life Asset Planner는  
> 하루의 선택과 자산의 흐름을  
> 웹과 앱에서 함께 기록하는 서비스입니다.”

