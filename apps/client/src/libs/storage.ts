import { forage } from '@tauri-apps/tauri-forage'

export class Storage {
  static set(key: string, value: any) {
    return forage.setItem({ key, value })()
  }

  static get<T>(key: string): Promise<T> {
    return forage.getItem({ key })()
  }

  static remove(key: string) {
    return forage.removeItem({ key })()
  }

  static has(key: string): Promise<boolean> {
    return forage.hasKey({ key })()
  }
}
