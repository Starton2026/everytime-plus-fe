# everytime-plus-fe

에브리타임 플러스 프론트엔드.

## 기술 스택

| 구분     | 사용 기술                        |
| -------- | -------------------------------- |
| 빌드     | Vite 8                           |
| 프레임워크 | React 19                       |
| 언어     | TypeScript 6 (strict)            |
| 스타일   | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 라우팅   | React Router 7                   |
| 린트     | Oxlint                           |

## 실행

```bash
npm install
```

```bash
npm run dev
```

| 스크립트          | 설명                       |
| ----------------- | -------------------------- |
| `npm run dev`     | 개발 서버 실행             |
| `npm run build`   | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기         |
| `npm run lint`    | Oxlint 검사                |

## 폴더 구조

Feature-based(기능 단위) 구조를 따릅니다.

```
src/
├─ main.tsx             # 번들 엔트리 (createRoot)
├─ index.css            # 전역 스타일 + 디자인 토큰 (@theme)
├─ app/                 # 앱 전역 레이어
│  ├─ App.tsx           # 루트 컴포넌트 (Router · Provider 조합)
│  ├─ providers/        # AuthProvider, ToastProvider
│  ├─ layouts/          # AppShell (상단 바 + 컨테이너)
│  └─ routes/           # AppRoutes, ProtectedRoute
├─ pages/               # 라우트에 1:1 대응하는 페이지 컴포넌트
├─ features/            # 기능 단위 모듈 (auth · board · post · comment)
├─ shared/              # 여러 기능에서 공유하는 자원
│  ├─ api/              # 에러 타입, 토큰 보관소, 태그 API
│  ├─ components/       # 재사용 UI 컴포넌트
│  ├─ constants/        # 라우트 경로, 태그 그룹
│  ├─ hooks/            # 공용 훅
│  ├─ lib/              # 유틸 함수
│  ├─ styles/           # 공용 스타일
│  └─ types/            # API 응답 타입
├─ mocks/               # 백엔드 대신 쓰는 예시 데이터 (임시)
└─ assets/              # 번들에 포함되는 이미지 등 정적 리소스
```

`public/`은 번들을 거치지 않고 그대로 복사되는 파일(favicon, robots.txt 등)을 두는 곳입니다. 현재는 비어 있습니다.

### 의존성 규칙

의존은 아래 방향으로만 흐릅니다. 역방향 import는 금지합니다.

```
app  →  pages  →  features  →  shared
```

- `shared`는 어떤 레이어도 import 하지 않습니다.
- `features` 간 직접 import는 피하고, 필요하면 `pages`에서 조합합니다.
- 각 `features/*`는 필요한 만큼만 하위 폴더(`api`, `components`, `hooks`, `model`, `types`)를 만들어 사용합니다.

`src/mocks`는 이 규칙 바깥에 있는 **임시 데이터 소스**입니다. 각 feature의 `api/`가 실제 서버 대신
`src/mocks`를 호출하며, 백엔드가 붙으면 `api/` 내부 구현만 fetch로 교체하고 `src/mocks`는 삭제합니다.

## 경로 별칭

`@`는 `src`를 가리킵니다.

```ts
import { Button } from '@/shared/components/Button'
```

설정 위치: [tsconfig.app.json](tsconfig.app.json)의 `paths`, [vite.config.ts](vite.config.ts)의 `resolve.alias`. 두 곳 모두 함께 수정해야 합니다.

## 화면 구성

| 경로 | 화면 | 인증 |
| --- | --- | --- |
| `/login` | 로그인 | — |
| `/signup` | 회원가입 | — |
| `/` | 게시판 목록 (메인) | 필요 |
| `/boards/:boardId/posts` | 게시글 리스트 (검색 · 태그 필터 · 페이지네이션) | 필요 |
| `/boards/:boardId/posts/new` | 글쓰기 | 필요 |
| `/posts/:postId` | 게시글 상세 + 댓글 | 필요 |
| `/posts/:postId/edit` | 글 수정 (작성자만) | 필요 |

게시글 리스트의 검색어·태그·페이지는 **URL 쿼리로 관리**합니다
(`?search=시험&tags=과제,시험&page=2`). 덕분에 새로고침·뒤로가기·링크 공유가 그대로 동작하고,
상세 화면에서 태그를 눌렀을 때도 같은 경로로 이동합니다.

## 디자인

에브리타임 앱을 웹으로 옮긴다는 컨셉의, 레드 브랜드 컬러 기반 디자인입니다.

- 색·폰트·레이아웃 토큰은 [src/index.css](src/index.css)의 `@theme` 블록 한 곳에서 관리합니다.
  (`brand-*`, `ink-*`, `canvas`, `surface`, `line`, `container-shell`)
- Tailwind CSS 4를 쓰므로 `tailwind.config.js`는 만들지 않습니다.
- 반응형: 기본은 모바일 앱과 같은 단일 컬럼이고, `lg` 이상에서 게시글 리스트 우측에
  태그 필터 사이드바가 붙습니다. 그 아래 폭에서는 같은 필터가 바텀시트로 열립니다.

## Mock 데이터

백엔드 연동 전이라 모든 API는 [src/mocks](src/mocks)의 예시 데이터로 동작합니다.

| 경로 | 내용 |
| --- | --- |
| `mocks/data/` | 사용자 · 게시판 · 게시글 · 댓글 · 태그 시드 데이터 |
| `mocks/db.ts` | 인메모리 DB (localStorage에 함께 저장) |
| `mocks/session.ts` | 토큰 발급 · 검증 (Authorization 헤더 흉내) |

- **데모 계정: `demo` / `demo1234`** — 로그인 화면에서 바로 채워 넣을 수 있습니다.
- 작성한 글·댓글·좋아요는 새로고침해도 유지됩니다. localStorage에 저장되기 때문입니다.
- 시드 데이터를 수정했는데 화면에 반영되지 않으면 `mocks/db.ts`의 `STORAGE_VERSION`을 올리거나
  브라우저 저장소에서 `etp.mockDb.v1` 키를 지우면 됩니다.

## 문서

| 파일 | 내용 |
| --- | --- |
| [docs/feature-spec.md](docs/feature-spec.md) | 기능정의서 |
| [docs/api-spec.md](docs/api-spec.md) | API 명세서 + 프론트에서 추가로 필요한 필드 정리 |

## 배포

SPA이므로 모든 경로를 `index.html`로 돌려주는 rewrite 설정이 필요합니다.
(Vercel `rewrites`, Netlify `_redirects`, Nginx `try_files`)
설정하지 않으면 `/posts/1` 같은 주소로 직접 접속했을 때 404가 납니다.
