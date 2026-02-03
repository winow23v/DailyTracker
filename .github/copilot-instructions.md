목적
----
이 문서는 Next.js + Supabase 기반의 이 프로젝트에서 AI 코딩 에이전트가 빠르게 생산적으로 일할 수 있도록 프로젝트 특화 가이드를 제공합니다.

아키텍처 개요
-------------
- 프레임워크: Next.js 13 (App Router). 소스는 `src/app`에 있으며 기본적으로 서버 컴포넌트입니다.
- 루트 레이아웃: `src/app/layout.tsx`가 전역 Provider, 폰트, 레이아웃 구조를 설정합니다.
- UI와 컴포넌트: 재사용 UI는 `src/components/*`에 위치합니다. 예: `src/components/layout/ResponsiveNav.tsx`, `src/components/layout/TopBar.tsx`.
- 인증 및 백엔드: Supabase를 사용합니다. 서버사이드 통합은 `src/middleware.ts`, 클라이언트 헬퍼는 `src/lib/supabase/client.ts`에 있습니다.

핵심 통합 포인트
-----------------
- 서버사이드 Supabase: `src/middleware.ts`에서 `createServerClient(...)`로 서버 클라이언트를 생성하고 세션을 갱신합니다. 인증 흐름 변경 시 이 미들웨어를 확인하세요.
- 클라이언트 Supabase: 클라이언트 컴포넌트에서는 `src/lib/supabase/client.ts`의 `createClient()`를 사용하세요. 해당 파일은 `"use client"`를 포함합니다.
- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 필요합니다. `.env.local`에 설정되어 있지 않으면 런타임에서 예외를 던집니다.
- 테마 지속성: `ThemeProvider`가 `life-asset-planner-theme` 키로 테마를 저장합니다. 테마 관련 변경은 이 Provider를 통해 진행하세요.

개발/빌드 워크플로
------------------
- 개발 서버: `npm run dev` (또는 `yarn dev`, `pnpm dev`) — 기본 호스트 `http://localhost:3000`.
- 빌드: `npm run build` (실행: `next build`).
- 프로덕션 시작: `npm run start` (실행: `next start`).
- 린트: `npm run lint` (실행: `eslint`).

프로젝트 규약 및 패턴
--------------------
- App Router: `src/app`의 파일은 서버 컴포넌트입니다. 클라이언트 상태가 필요하면 파일 최상단에 `"use client"`를 추가하세요 (예: `src/lib/supabase/client.ts`).
- 컴포넌트 분리: 작은 재사용 가능한 컴포넌트로 구성하세요. 전역 변경은 `src/app/layout.tsx`를 건드리기보단 하위 컴포넌트로 해결하는 것을 권장합니다.
- 환경 변수 처리: 환경 변수에 의존하는 코드에는 명확한 에러 메시지를 추가하세요(레포에는 이미 예외처리가 포함되어 있음).
- 알림: `sonner` Toaster가 `src/app/layout.tsx`에서 등록되어 있습니다(`src/components/ui/sonner.tsx`의 `Toaster`).

AI 에이전트용 편집 지침 (해야 할 것 / 하지 말아야 할 것)
-------------------------------------------------
- 해야 할 것: 서버 사이드 Supabase 변경은 `src/middleware.ts` 또는 서버 컴포넌트 패턴으로 구현하세요. 쿠키와 세션 갱신 로직을 고려해야 합니다.
- 해야 할 것: 클라이언트 측 Supabase는 `createClient()`를 사용하고, 해당 파일과 클라이언트 컴포넌트에서 `"use client"`를 유지하세요.
- 해야 할 것: `src/app/layout.tsx`는 전역 Provider를 연결하므로 수정은 최소화하세요.
- 하지 않을 것: 브라우저 전용 API를 서버 컴포넌트에 추가하지 마세요. 브라우저 API가 필요하면 파일을 클라이언트 컴포넌트로 변환하세요.

예시 참조
---------
- 클라이언트 Supabase 사용 예: `import { createClient } from "src/lib/supabase/client"` (해당 파일은 `"use client"` 포함).
- 서버 미들웨어 예: `src/middleware.ts`에서 쿠키 인터페이스와 `createServerClient(...)` 사용 방식 확인.
- 전역 레이아웃/Provider 예: `src/app/layout.tsx`, `src/components/providers/ThemeProvider.tsx` 참고.

주의할 점 (가정하지 말 것)
-------------------------
- 레포 루트에 자동화된 테스트나 CI 스크립트가 없습니다. 로컬에서 수동 검증을 수행하세요.
- ESLint는 의존성에 포함되어 있으나 별도 커스텀 스크립트는 없습니다. `npm run lint`로 확인하세요.

런타임/환경변수 변경 시
----------------------
- `.env.local`이나 런타임 변경이 필요한 경우 PR 상단에 요구 변수와 로컬 설정 방법을 명시하세요. 기존 `src/lib/supabase/client.ts`와 유사한 명확한 오류 메시지를 권장합니다.

PR/머지 팁
----------
- PR은 작고 집중적으로 만드세요. 변경한 라우트(예: `src/app/history/page.tsx`)를 PR 설명에 명시하세요.
- 인증/세션 관련 코드를 변경하면 수동 테스트 체크리스트(로그인/로그아웃, 세션 갱신)를 포함하세요.

이미 파일이 존재할 경우
----------------------
기존 `.github/copilot-instructions.md`가 있을 경우 보수적으로 병합하세요: 프로젝트 고유 노트를 보존하고 필요한 부분만 갱신합니다.

질문 / 누락된 정보
-------------------
CI 설정, 배포(Vercel) 링크, 또는 환경 변수 프로비저닝 등 레포에서 찾을 수 없는 정보는 저장소 소유자에게 문의하세요.

---
요청: 이 초안을 검토해 주세요. CI, 배포, 또는 컴포넌트 규약에 대해 더 자세히 원하시면 알려주시면 추가합니다.
