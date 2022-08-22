/// <reference types="vue/macros-global" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
