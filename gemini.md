# Life Asset Planner – 개발용 PRD (Product Requirements Document)

본 문서는 **Life Asset Planner**의 실제 개발을 위한 기준 문서(PRD)입니다.
기능 범위, 사용자 흐름, 데이터 단위, 비기능 요구사항을 명확히 정의하여
**설계·개발·검증 단계에서 단일 기준(Single Source of Truth)**으로 사용합니다.

---

## 1. 제품 개요

### 1.1 제품 목적

* 사용자의 **하루 단위 행동·자산·투자 판단**을 하나의 기록 흐름으로 통합
* 숫자 관리가 아닌 **의사결정 히스토리 축적**이 핵심 가치

### 1.2 타겟 사용자

* 개인 자산 관리에 관심 있는 개인 사용자
* To‑Do / 가계부 / 투자 앱을 분산 사용 중인 사용자
* 모바일 중심 사용, 웹 보조 사용

### 1.3 핵심 원칙 (Non‑Negotiables)

* Today = Home
* 모든 데이터는 **Daily Page**에 귀속
* 삭제 최소화, 기록 유지
* 페이지 이동보다 상태 전환

---

## 2. 플랫폼 & 기술 스택

### 2.1 플랫폼

* Web: Next.js
* Mobile: React Native (Expo)
* Backend: Supabase

### 2.2 기술 스택

* Frontend: TypeScript, Tailwind CSS
* Backend: PostgreSQL, Supabase Auth, RLS
* Deployment: Vercel

---

## 3. 사용자 플로우 (High‑Level)

### 3.1 최초 진입

1. 로그인 / 회원가입
2. Today(Daily Dashboard) 자동 진입
3. 해당 날짜의 Daily Page 자동 생성

### 3.2 일상 사용 흐름

* 앱 실행 → Today 확인
* To‑Do 처리
* 수입/지출/투자 발생 시 즉시 기록
* 하루 종료 시 회고(Optional)

---

## 4. 정보 구조 (IA)

모바일을 기준으로 **명확히 분리된 1~4번 핵심 페이지**를 가진 구조를 사용합니다.

```
Mobile App (Primary)
 ├─ 1. Tasks (To-Do)
 ├─ 2. Money (Income / Expense)
 ├─ 3. Market (Financial Info)
 ├─ 4. Settings
```

* Mobile: Bottom Navigation (4 Tabs)
* Desktop(Web): 동일한 정보 구조를 Sidebar로 확장

---

## 5. 핵심 기능 요구사항 (Functional Requirements)

### 5.1 Page 1 – Tasks (나의 할 일)

**목적**

* 사용자의 하루 실행력을 관리하는 최우선 화면

**구성**

* 오늘의 To-Do 리스트
* 미완료 작업 우선 노출

**필드**

* title
* status (pending / in_progress / done)
* priority
* memo

**요구사항**

* 기본 진입 화면
* Daily Page 기준 자동 연결
* Drag 또는 탭으로 상태 변경
* 완료 항목은 접힘 처리

---

### 5.2 Page 2 – Money (수입 / 지출 관리)

**목적**

* 개인 자산 흐름을 시간 단위로 관리

**지원 단위**

* 일간 / 주간 / 월간 / 연간

**공통 필드**

* amount
* currency (KRW | USD)
* type (income | expense)
* category
* memo
* exchange_rate_snapshot

**요구사항**

* 기간 필터 즉시 전환
* 총 수입 / 총 지출 / 순자산 변화 요약 카드
* 기록 시점 환율 고정
* 숫자보다 소비·수입의 맥락 메모 우선

---

### 5.3 Page 3 – Market (금융 시장 정보)

**목적**

* 현재 금융 시장 상황을 빠르게 파악하고
  사용자의 판단을 돕는 참고 화면

**포함 정보 (MVP)**

* 주요 지수 (KOSPI, NASDAQ, S&P500)
* 환율 (USD/KRW)
* 금리 / 원자재 요약 (선택)

**요구사항**

* 읽기 전용(Read-only)
* 외부 API 기반 데이터 표시
* 과도한 분석 기능 제외
* Money / 투자 판단의 참고 지표 역할

---

### 5.4 Page 4 – Settings

* 프로필
* 테마 (다크/라이트)
* 통화 기본값
* 데이터 백업 / 초기화

---

## 6. Reports (Money 내부 기능)

Reports는 독립 페이지가 아니라 **Money 페이지 내부의 기간 뷰**로 제공됩니다.

**범위**

* 일간 / 주간 / 월간 / 연간

**요구사항**

* 기간별 총 수입 / 총 지출
* 카테고리 비중
* 단순 그래프 + 수치 요약

---

## 7. 데이터 모델 (개념)

* User
* DailyPage
* Todo
* Income
* Expense
* ExchangeRate
* StockTrade
* Reflection

---

## 8. 비기능 요구사항 (Non‑Functional)

### 8.1 성능

* Today 로딩 1초 이내

### 8.2 보안

* Supabase RLS 필수
* User 데이터 완전 분리

### 8.3 접근성

* 모바일 터치 타깃 44px 이상
* 다크모드 기본 지원

---

## 9. MVP 범위 정의

**포함**

* Auth
* Daily Page
* To‑Do
* 수입 / 지출
* 환율

**제외 (v2)**

* 고급 분석
* AI 요약
* 알림 자동화

---

## 10. 성공 지표 (초기)

* DAU / WAU
* Daily Page 생성 유지율
* 기록 누락률 감소

---

## 11. 개발 원칙

* 모바일 퍼스트
* 재사용 컴포넌트 우선
* 기능보다 흐름

---

## 12. PRD 변경 관리

* 변경 시 버전 태깅
* 기능 추가 시 MVP 영향도 명시
