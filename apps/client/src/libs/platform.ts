// @ts-ignore
export const isTauri = () => !!window.__TAURI__
export const isWeb = () => !isTauri()
