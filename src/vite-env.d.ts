/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 백엔드 API 주소. .env.local에서 설정한다. (저장소에 올리지 않음) */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
