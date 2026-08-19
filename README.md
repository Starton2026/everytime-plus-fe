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
│  ├─ api/              # HTTP 클라이언트, 에러 타입, 토큰 보관소, 태그 API
│  ├─ components/       # 재사용 UI 컴포넌트
│  ├─ constants/        # 라우트 경로, 태그 그룹
│  ├─ hooks/            # 공용 훅
│  ├─ lib/              # 유틸 함수
│  ├─ styles/           # 공용 스타일
│  └─ types/            # API 응답 타입
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
| `/boards/:boardId/posts/:postId` | 게시글 상세 + 댓글 | 필요 |
| `/boards/:boardId/posts/:postId/edit` | 글 수정 (작성자만) | 필요 |

게시글 리스트의 검색어·태그·페이지는 **URL 쿼리로 관리**합니다
(`?search=시험&tags=과제,시험&page=2`). 덕분에 새로고침·뒤로가기·링크 공유가 그대로 동작하고,
상세 화면에서 태그를 눌렀을 때도 같은 경로로 이동합니다.

상세·수정 경로에 `boardId`를 두어 "게시판 > 게시글" 구조를 주소에 그대로 담았습니다.
주소를 손으로 고쳐 다른 게시판 번호로 들어오더라도, 화면 안의 이동은 응답의 `board_id`를
기준으로 하므로 항상 실제 게시판으로 돌아갑니다.

## 디자인

에브리타임 앱을 웹으로 옮긴다는 컨셉의, 레드 브랜드 컬러 기반 디자인입니다.

- 색·폰트·레이아웃 토큰은 [src/index.css](src/index.css)의 `@theme` 블록 한 곳에서 관리합니다.
  (`brand-*`, `ink-*`, `canvas`, `surface`, `line`, `container-shell`)
- Tailwind CSS 4를 쓰므로 `tailwind.config.js`는 만들지 않습니다.
- 반응형: 기본은 모바일 앱과 같은 단일 컬럼이고, `lg` 이상에서 게시글 리스트 우측에
  태그 필터 사이드바가 붙습니다. 그 아래 폭에서는 같은 필터가 바텀시트로 열립니다.

## 백엔드 연동

같은 팀의 FastAPI 서버(`everytime-plus-be`)를 호출합니다. 서버를 먼저 띄운 뒤 프론트를 실행하세요.

```bash
uvicorn main:app --reload
```

| 항목 | 값 |
| --- | --- |
| 기본 주소 | `http://localhost:8000` |
| 변경 방법 | `.env`에 `VITE_API_BASE_URL=...` |
| Swagger | http://localhost:8000/docs |

- 서버 CORS는 `localhost`와 `127.0.0.1`의 3000·5173 포트를 허용합니다. 다른 주소로 띄우려면
  백엔드 `main.py`의 `allow_origins`에 추가해야 합니다.
- 백엔드 저장소의 `python seed.py`를 실행하면 테스트 계정(`testuser` / `test1234`)과 샘플 글이 생깁니다.
  실행하지 않아도 회원가입으로 바로 시작할 수 있고, 게시판 3개는 서버가 알아서 만들어 줍니다.

### API 레이어 구조

| 파일 | 역할 |
| --- | --- |
| `shared/api/httpClient.ts` | fetch 래퍼. Authorization 헤더 부착, 에러를 `ApiError`로 변환 |
| `shared/api/authSession.ts` | accessToken 보관 (localStorage) |
| `features/*/api/*.ts` | 도메인별 호출 + snake_case ↔ camelCase 변환 |

서버는 snake_case를, 화면 코드는 camelCase를 씁니다. 변환은 각 `features/*/api/*.ts`의 매퍼가 맡고
화면 컴포넌트는 서버 형식을 몰라도 됩니다. 좋아요 타입도 화면에서는 `"LIKE"`/`"DISLIKE"`,
서버로는 `"like"`/`"dislike"`로 매퍼가 바꿔서 보냅니다.

목록과 검색은 서버 엔드포인트가 다르지만(`/boards/{id}/posts`, `/search`) 응답 형태가 같아
`fetchPosts()` 하나로 감쌌습니다. 검색어나 태그가 있으면 `/search`로, 없으면 목록으로 나갑니다.

작성자 판별(`is_mine`), 좋아요 상태(`my_reaction`), 게시판 정보(`board_id`), 댓글 수는 서버 응답에
포함됩니다. 이 값들은 로그인했을 때만 채워지므로, 목록·상세 조회에도 토큰을 함께 보냅니다.
초안 명세서와의 차이는 [docs/api-spec.md](docs/api-spec.md)의 부록에 정리되어 있습니다.

## 문서

| 파일 | 내용 |
| --- | --- |
| [docs/feature-spec.md](docs/feature-spec.md) | 기능정의서 |
| [docs/api-spec.md](docs/api-spec.md) | API 명세서 초안 + **실제 백엔드 기준 정리** (부록) |

## 배포

SPA이므로 모든 경로를 `index.html`로 돌려주는 rewrite 설정이 필요합니다.
(Vercel `rewrites`, Netlify `_redirects`, Nginx `try_files`)
설정하지 않으면 `/boards/1/posts/3` 같은 주소로 직접 접속했을 때 404가 납니다.

배포 시에는 `VITE_API_BASE_URL`을 배포된 백엔드 주소로 지정하고, 백엔드 `main.py`의 CORS
`allow_origins`에도 프론트 배포 주소를 추가해야 합니다.
