import { customRef } from 'vue'

const focusableElementsSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useTrapFocus<T extends HTMLElement>() {
  let focusableElements: HTMLElement[] = []
  let $firstFocusable: HTMLElement
  let $lastFocusable: HTMLElement

  const trapRef = customRef((track, trigger) => {
    let $trapEl: T | null = null

    return {
      get() {
        track()
        return $trapEl
      },
      set(value) {
        $trapEl = value
        value ? initFocusTrap() : clearFocusTrap()

        trigger()
      },
    }
  })

  function keyHandler(e: Event & { key: string; shiftKey: boolean }) {
    const isTabPressed = e.key === 'Tab'
    if (!isTabPressed) return

    if (e.shiftKey && document.activeElement === $firstFocusable) {
      $lastFocusable.focus()
      e.preventDefault()
    }

    if (!e.shiftKey && document.activeElement === $lastFocusable) {
      $firstFocusable.focus()
      e.preventDefault()
    }
  }

  function initFocusTrap() {
    if (!trapRef.value) return

    focusableElements = Array.from(
      trapRef.value.querySelectorAll(focusableElementsSelector),
    )

    $firstFocusable = focusableElements[0]
    $lastFocusable = focusableElements[focusableElements.length - 1]

    document.addEventListener('keydown', keyHandler)

    setTimeout(() => {
      $firstFocusable.focus()
    }, 0)
  }

  function clearFocusTrap() {
    document.removeEventListener('keydown', keyHandler)
  }

  return {
    trapRef,
    initFocusTrap,
    clearFocusTrap,
  }
}
