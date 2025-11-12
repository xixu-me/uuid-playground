import { useEffect } from 'react'

export function useKeyboard(callback: () => void, keys: string[]) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (keys.includes(event.key) || keys.includes(event.code)) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [callback, keys])
}
