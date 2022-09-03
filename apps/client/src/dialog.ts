import { open as tauriOpen } from '@tauri-apps/api/dialog'
import { desktopDir, downloadDir } from '@tauri-apps/api/path'

type TauriOpenOptions = NonNullable<Parameters<typeof tauriOpen>['0']>
type OpenOptions = TauriOpenOptions & { strict?: boolean }

export function open(
  option: OpenOptions & { multiple: false },
): Promise<string | null>
export function open(option?: OpenOptions): Promise<string | string[]>
export async function open(option?: OpenOptions) {
  const { strict, ...tauriOption } = option || {}

  const path = await tauriOpen(tauriOption)

  if (!strict) return path
  if (path === null) return path

  const [desktop, download] = await Promise.all([desktopDir(), downloadDir()])

  if (
    Array.isArray(path) &&
    path.some((p) => !p.startsWith(desktop) && !p.startsWith(download))
  ) {
    return null
  }

  if (
    !Array.isArray(path) &&
    !path.startsWith(desktop) &&
    !path.startsWith(download)
  ) {
    return null
  }

  return path
}
