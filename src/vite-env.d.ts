/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 백엔드 API 주소. 없으면 http://localhost:8000 을 쓴다. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
