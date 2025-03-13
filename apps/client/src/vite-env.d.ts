/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_DOMAIN: string;
  readonly VITE_REMOTE_DEV: string;
}
