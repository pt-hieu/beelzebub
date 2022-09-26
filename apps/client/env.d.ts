/// <reference types="vue/macros-global" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string
  readonly VITE_LOCAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
