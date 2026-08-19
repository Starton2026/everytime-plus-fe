# everytime-plus-fe

대학 커뮤니티 앱 **에브리타임**을 웹으로 옮긴 클론 프로젝트의 프론트엔드입니다.
게시판에 글을 쓰고 댓글을 달 수 있고, **태그로 게시글을 걸러 보는 것이 이 프로젝트의 핵심 기능**입니다.

```
로그인 / 회원가입
   └─ 게시판 목록 (자유 · 새내기 · 졸업생)
        └─ 게시글 리스트 ── 검색 + 태그 필터 ── 글쓰기
             └─ 게시글 상세 + 댓글 ── 수정 / 삭제
```

백엔드는 별도 저장소([`everytime-plus-be`](https://github.com/Starton2026/everytime-plus-be), FastAPI + SQLite)이고,
이 저장소는 그 REST API를 호출하는 화면만 담당합니다.

---

## 목차

- [기능](#기능)
- [실행 방법](#실행-방법)
- [화면 구성](#화면-구성)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [디자인](#디자인)
- [백엔드 연동](#백엔드-연동)
- [주요 결정과 이유](#주요-결정과-이유)
- [배포](#배포)

---

## 기능

### 인증

- 회원가입 시 바로 로그인됩니다. accessToken을 localStorage에 저장해 새로고침해도 로그인이 유지됩니다.
- 토큰이 만료되면 자동으로 로그아웃하고 로그인 화면으로 보냅니다.
- 입력 규칙: 닉네임 10자 이하(특수문자·공백 불가), 아이디 영문·숫자 4~20자, 비밀번호 8~64자.

### 태그 필터링 (핵심)

- 태그를 **여러 개** 고를 수 있고, 선택한 태그를 **모두** 가진 게시글만 보여줍니다 (AND 조건).
- 검색어와 태그가 동시에 걸립니다. 예를 들어 `시험`을 검색하고 `#과제`를 고르면
  "시험"이 들어 있고 `#과제` 태그가 붙은 글만 남습니다.
- 검색 결과는 제목과 본문 미리보기에서 키워드를 하이라이팅합니다.
- 게시글 상세에서 태그를 누르면 그 태그로 필터링된 목록으로 이동합니다.

### 게시글 · 댓글

- 게시글 작성 / 수정 / 삭제 (수정·삭제는 작성자만).
- 익명 작성. 익명으로 쓰면 작성자가 "익명"으로 표시되지만, 본인은 그대로 수정·삭제할 수 있습니다.
- 댓글 작성 / 삭제 (삭제는 작성자만, 수정은 제공하지 않음).
- 게시글·댓글 좋아요 / 싫어요. 사용자당 하나만 고를 수 있고, 같은 버튼을 다시 누르면 취소됩니다.

### 입력 제한

| 항목 | 규칙 |
| --- | --- |
| 제목 | 1~100자, 공백만 입력 불가, 앞뒤 공백 자동 제거 |
| 본문 | 1~2000자 |
| 태그 | 최대 3개 |
| 댓글 | 1~300자 |
| 검색어 | 1~50자, 공백만 입력 불가 |

---

## 실행 방법

백엔드가 떠 있어야 화면이 동작합니다. **백엔드 → 프론트엔드 순서로** 실행하세요.

### 1. 백엔드 실행

[`everytime-plus-be`](https://github.com/Starton2026/everytime-plus-be) 저장소에서:

```bash
python -m venv .venv && source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

```bash
python seed.py
```

```bash
uvicorn main:app --reload
```

- `python seed.py`는 테스트 계정(**`testuser` / `test1234`**)과 샘플 게시글을 만듭니다.
  건너뛰어도 회원가입으로 바로 시작할 수 있고, 게시판 3개는 서버가 알아서 만들어 줍니다.
- 서버는 `http://localhost:8000`에 뜨고, `http://localhost:8000/docs`에서 API를 직접 호출해볼 수 있습니다.

### 2. 프론트엔드 실행

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

`http://localhost:5173`으로 접속합니다.

> **다른 주소를 쓰려면** `.env.local`의 `VITE_API_BASE_URL`을 바꾸세요.
> Vite는 개발 서버가 뜰 때 환경 변수를 읽으므로, 고친 뒤에는 `npm run dev`를 다시 실행해야 반영됩니다.

### 스크립트

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 검사 |

테스트 러너는 넣지 않았습니다. 화면 동작은 직접 확인하고, 타입 검증은 `npm run build`로 합니다.

---

## 화면 구성

| 경로 | 화면 | 로그인 |
| --- | --- | --- |
| `/login` | 로그인 | — |
| `/signup` | 회원가입 | — |
| `/` | 게시판 목록 (메인) | 필요 |
| `/boards/:boardId/posts` | 게시글 리스트 (검색 · 태그 필터 · 페이지네이션) | 필요 |
| `/boards/:boardId/posts/new` | 글쓰기 | 필요 |
| `/boards/:boardId/posts/:postId` | 게시글 상세 + 댓글 | 필요 |
| `/boards/:boardId/posts/:postId/edit` | 글 수정 (작성자만) | 필요 |

로그인이 필요한 경로는 `ProtectedRoute`로 감싸서, 토큰이 없으면 로그인 화면으로 보냅니다.

---

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 빌드 | Vite 8 |
| 프레임워크 | React 19 |
| 언어 | TypeScript 6 (strict) |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 라우팅 | React Router 7 |
| 린트 | Oxlint |

상태 관리 라이브러리나 데이터 페칭 라이브러리는 넣지 않았습니다.
화면 수가 7개고 서버 상태를 공유하는 화면이 거의 없어서, React 기본 기능(`useState` · `useEffect` · Context)으로 충분했습니다.

---

## 폴더 구조

Feature-based(기능 단위) 구조입니다.

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
│  └─ types/            # API 응답 타입
└─ assets/              # 번들에 포함되는 이미지 등 정적 리소스
```

### 의존성 규칙

의존은 아래 방향으로만 흐릅니다. 역방향 import는 금지합니다.

```
app  →  pages  →  features  →  shared
```

- `shared`는 어떤 레이어도 import 하지 않습니다.
- `features` 간 직접 import는 피하고, 필요하면 `pages`에서 조합합니다.
- 각 `features/*`는 필요한 만큼만 하위 폴더(`api`, `components`, `hooks`, `model`, `types`)를 만듭니다.

### 경로 별칭

`@`는 `src`를 가리킵니다.

```ts
import { Button } from '@/shared/components/Button'
```

설정 위치는 [tsconfig.app.json](tsconfig.app.json)의 `paths`와 [vite.config.ts](vite.config.ts)의 `resolve.alias` 두 곳입니다. **둘 다 함께 고쳐야 동작합니다.**

---

## 디자인

에브리타임 앱을 웹으로 옮긴다는 컨셉으로, 앱의 레드 브랜드 컬러를 기준으로 잡았습니다.

- 색 · 폰트 · 레이아웃 토큰은 [src/index.css](src/index.css)의 `@theme` 블록 **한 곳**에서 관리합니다.
  (`brand-*`, `ink-*`, `canvas`, `surface`, `line`, `container-shell`)
- Tailwind CSS 4를 쓰므로 `tailwind.config.js`는 만들지 않습니다. 테마 확장은 `@theme`에서 합니다.
- 반응형: 기본은 모바일 앱과 같은 단일 컬럼이고, `lg` 이상에서 게시글 리스트 우측에
  태그 필터 사이드바가 붙습니다. 그 아래 폭에서는 **같은 필터 컴포넌트**가 바텀시트로 열립니다.
  데스크톱 사이드바는 누르는 즉시 적용되고, 바텀시트는 "적용"을 눌러야 반영됩니다.

---

## 백엔드 연동

### 호출하는 API

| 기능 | 엔드포인트 |
| --- | --- |
| 인증 | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me` |
| 게시판 | `GET /boards` |
| 게시글 목록 | `GET /boards/{boardId}/posts?page=&size=` |
| 검색 · 태그 필터 | `GET /search?board_id=&keyword=&tags=&page=&size=` |
| 게시글 | `POST /posts`, `GET /posts/{id}`, `PUT /posts/{id}`, `DELETE /posts/{id}` |
| 댓글 | `GET·POST /posts/{id}/comments`, `DELETE /posts/{id}/comments/{cid}` |
| 반응 | `POST /posts/{id}/reaction`, `POST /comments/{id}/reaction` |
| 태그 | `GET /tags` |

### API 레이어 구조

| 파일 | 역할 |
| --- | --- |
| `shared/api/httpClient.ts` | fetch 래퍼. Authorization 헤더 부착, 에러를 `ApiError`로 변환 |
| `shared/api/authSession.ts` | accessToken 보관 (localStorage) |
| `features/*/api/*.ts` | 도메인별 호출 + 서버 형식 ↔ 화면 형식 변환 |

**서버 형식은 API 레이어에서만 다룹니다.** 서버는 snake_case를, 화면 코드는 camelCase를 씁니다.
좋아요 타입도 화면에서는 `"LIKE"` / `"DISLIKE"`, 서버로는 `"like"` / `"dislike"`입니다.
이 변환을 각 `features/*/api/*.ts`의 매퍼가 맡아서, 화면 컴포넌트는 서버 형식을 몰라도 됩니다.

### 환경 변수

| 파일 | 용도 | 커밋 |
| --- | --- | --- |
| `.env.example` | 필요한 키를 적어둔 템플릿 | O |
| `.env.local` | 실제로 쓰는 값 | X (`.gitignore`) |

| 변수 | 설명 |
| --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 주소. 끝에 `/`를 붙이지 않습니다. 값이 없으면 `http://localhost:8000` |

### CORS

백엔드는 `localhost`와 `127.0.0.1`의 3000 · 5173 포트를 허용합니다.
다른 주소로 띄우면 백엔드 `main.py`의 `allow_origins`에 그 주소를 추가해야 요청이 통과합니다.

---

## 주요 결정과 이유

이 프로젝트에서 판단이 필요했던 부분과 그렇게 정한 이유입니다.

### 1. mock 데이터로 화면을 먼저 만들고, 나중에 실제 API로 교체했다

작업을 시작할 때 백엔드가 거의 구현되지 않은 상태였습니다.
API를 기다리면 화면 작업이 멈추므로, `src/mocks`에 인메모리 DB와 예시 데이터(사용자 · 게시글 27개 · 댓글 38개)를
만들어 화면을 전부 완성했습니다.

이때 **mock 함수의 시그니처를 API 명세와 같게 맞춰뒀습니다.** 덕분에 백엔드가 준비된 뒤에는
각 `features/*/api/*.ts` 내부만 `fetch` 호출로 바꾸고 `src/mocks`를 삭제하는 것으로 끝났고,
화면 컴포넌트는 거의 손대지 않았습니다.

### 2. 검색어 · 태그 · 페이지를 컴포넌트 상태가 아니라 URL 쿼리에 두었다

`?search=시험&tags=과제,시험&page=2` 형태로 관리합니다.

이유는 세 가지입니다.
새로고침해도 필터가 유지되고, 뒤로 가기가 자연스럽게 동작하고, 필터가 걸린 목록을 링크로 공유할 수 있습니다.
게시글 상세에서 태그를 눌러 필터링된 목록으로 이동하는 기능도 같은 주소를 만들면 되니 따로 구현할 게 없습니다.

### 3. 태그 관련 코드는 `features`가 아니라 `shared`에 두었다

태그는 게시글 리스트 필터, 글쓰기, 상세, 게시판 목록의 "태그로 바로 찾기"에서 모두 쓰입니다.
`features/tag`로 만들면 `features/post`가 `features/tag`를 import해야 하는데, 이는 의존성 규칙 위반입니다.
여러 기능이 실제로 공유하는 자원이므로 `shared`에 두는 쪽이 맞다고 판단했습니다.

태그 목록 자체는 `GET /tags`에서 받고, 그룹 분류(일상 · 학사 · 진로)만 화면 표시용으로 프론트 상수에 둡니다.

### 4. 게시글 상세 · 수정 경로에 게시판 번호를 넣었다

`/posts/:postId`가 아니라 `/boards/:boardId/posts/:postId`입니다.
"게시판 > 게시글" 구조를 주소에 그대로 담아 목록으로 돌아가는 동작이 자연스럽습니다.

단, 화면 안의 이동은 URL 파라미터가 아니라 **응답의 `board_id`를 기준**으로 합니다.
주소를 손으로 고쳐 엉뚱한 게시판 번호로 들어와도 실제 게시판으로 돌아가게 하기 위한 처리입니다.

### 5. 시간 문자열을 UTC로 간주해서 파싱한다

백엔드가 `datetime.utcnow()`로 저장한 값을 타임존 없이 내려주고 있었습니다.
`"2026-08-19T04:26:23"`을 그대로 `new Date()`에 넣으면 브라우저가 **로컬 시간으로 해석해서
한국 기준 9시간 어긋납니다.** 방금 쓴 글이 "9시간 전"으로 표시되는 문제였습니다.

프론트에서는 시간 정보가 있는데 타임존이 없으면 UTC로 간주하도록 파싱을 고치고,
백엔드도 UTC임을 명시한 ISO 8601로 내려주도록 함께 수정했습니다.
(`shared/lib/formatDate.ts`)

### 6. 화면 구현에 필요한 응답 필드는 백엔드에 요청해서 추가했다

프론트에서 우회할 수도 있었지만, 정확하게 만들 수 없거나 비효율적인 것들이라 서버에서 내려주도록 했습니다.

| 필드 | 왜 필요했나 |
| --- | --- |
| `is_mine` | 수정 · 삭제는 작성자만 가능해야 하는데, **익명 글은 작성자명이 "익명"이라 프론트가 본인 글인지 알 수 없었습니다.** 처음에는 작성한 글 id를 localStorage에 기록하는 방식으로 우회했지만, 다른 기기에서 쓴 내 익명 글은 수정할 수 없는 한계가 있어 서버 판별로 바꿨습니다 |
| `my_reaction` | 좋아요를 눌러도 **새로고침하면 눌린 표시가 사라졌습니다.** 반응 API는 이 값을 주는데 조회 API에만 없었습니다 |
| `board_id` | 상세에서 목록으로 돌아가거나 태그를 눌러 이동할 때 어느 게시판인지 알아야 합니다 |
| `comment_count` | 리스트에 댓글 수를 표시하기 위함. 없으면 글마다 댓글 API를 따로 호출해야 합니다 |
| `total_pages` · `total_elements` | 목록이 전체 배열로 오고 있어서, 글이 늘어나면 프론트가 다 받아서 잘라 써야 했습니다. 서버 페이지네이션으로 바꿨습니다 |

`is_mine`과 `my_reaction`은 로그인했을 때만 채워지므로, **목록 · 상세 조회에도 토큰을 함께 보냅니다.**

### 7. 그 외 서버와 맞춘 동작

- **게시글 수정 시 익명 여부는 바꿀 수 없습니다.** `PUT /posts/{id}`가 `is_anonymous`를 받지 않아,
  수정 화면에서 읽기 전용으로 표시합니다.
- **반응은 같은 버튼을 다시 누르면 취소**되고, 이때 `my_reaction`이 `null`이 됩니다.
- **댓글 등록이 실패하면 입력한 내용을 지우지 않습니다.** 다시 쓰게 만들지 않기 위한 처리입니다.
- API 실패 메시지는 하단 토스트로 보여주고, 401이면 로그아웃 후 로그인 화면으로 보냅니다.
  (`features/auth/hooks/useApiErrorHandler.ts`)

---

## 배포

SPA이므로 모든 경로를 `index.html`로 돌려주는 rewrite 설정이 필요합니다.
(Vercel `rewrites`, Netlify `_redirects`, Nginx `try_files`)
설정하지 않으면 `/boards/1/posts/3` 같은 주소로 직접 접속했을 때 404가 납니다.

배포 환경에서는 두 가지를 함께 맞춰야 합니다.

1. `VITE_API_BASE_URL`을 배포된 백엔드 주소로 지정
2. 백엔드 `main.py`의 CORS `allow_origins`에 프론트 배포 주소 추가

---

## 참고

작업 기준이 된 기능정의서와 API 명세서는 `docs/`에 있습니다.
로컬 전용(`.gitignore`)이라 저장소에는 올라가지 않으므로, 필요하면 별도로 공유해야 합니다.
