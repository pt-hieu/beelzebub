import { Storage } from './storage.js'

const DARKMODE_CLASS = 'dark'
const DARKMODE_KEY = '@beelzebub/dark-mode'

export const enableDarkMode = () => {
  const html = document.querySelector('html')!
  return html.classList.add(DARKMODE_CLASS)
}

export const disableDarkMode = () => {
  const html = document.querySelector('html')!
  return html.classList.remove(DARKMODE_CLASS)
}

export const saveDarkModePref = async (clear: boolean) => {
  if (clear) {
    await Storage.remove(DARKMODE_KEY)
    return
  }

  await Storage.set(DARKMODE_KEY, Date.now().toString())
}

export const canRestoreDarkMode = () => {
  return Storage.has(DARKMODE_KEY)
}
