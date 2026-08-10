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
├─ index.css            # 전역 스타일 (Tailwind 진입점)
├─ app/                 # 앱 전역 레이어
│  ├─ App.tsx           # 루트 컴포넌트
│  ├─ providers/        # 전역 Provider (Router, Query, Theme 등)
│  └─ routes/           # 라우트 정의
├─ pages/               # 라우트에 1:1 대응하는 페이지 컴포넌트
├─ features/            # 기능 단위 모듈 (기능별 폴더로 분리)
├─ shared/              # 여러 기능에서 공유하는 자원
│  ├─ api/              # API 클라이언트 / 공통 요청 로직
│  ├─ components/       # 재사용 UI 컴포넌트
│  ├─ constants/        # 상수
│  ├─ hooks/            # 공용 훅
│  ├─ lib/              # 유틸 함수
│  ├─ styles/           # 공용 스타일 / 테마 토큰
│  └─ types/            # 공용 타입
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
