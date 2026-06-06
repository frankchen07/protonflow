// Focus Persistence Engine
// Solves ProtonMail's biggest UX problem: focus loss after returning from a message.

import { getMessageItems } from './dom'

export interface FocusEngineOptions {
  getCursorIndex: () => number
  setCursor: (index: number) => void
  getRestoreDelay: () => number
  log: (...args: unknown[]) => void
}

export function createFocusEngine(opts: FocusEngineOptions) {
  const { getCursorIndex, setCursor, getRestoreDelay, log } = opts

  // Maintain cursor highlight — enforce that ONLY the cursor item has pf-cursor
  const highlightInterval = setInterval(() => {
    const items = getMessageItems()
    const idx = getCursorIndex()
    // Remove stale highlights from any non-cursor items
    document.querySelectorAll('.pf-cursor').forEach((el) => {
      if (idx < 0 || !items[idx] || el !== items[idx]) {
        el.classList.remove('pf-cursor')
      }
    })
    if (idx >= 0 && idx < items.length) {
      const item = items[idx] as HTMLElement
      if (item && !item.classList.contains('pf-cursor')) {
        item.classList.add('pf-cursor')
      }
    }
  }, 300)

  // MutationObserver: detect message view close → restore focus
  let lastMessageOpenState = false

  const observer = new MutationObserver(() => {
    const items = getMessageItems()
    const idx = getCursorIndex()

    // Reset if message list shrunk past cursor
    if (idx >= items.length) {
      setCursor(-1)
      return
    }

    // Detect message view close: was open, now gone → restore focus to list
    const isOpen = document.querySelector('[class*="message-view"], [class*="conversation-view"], [role="article"]') !== null
    if (lastMessageOpenState && !isOpen && idx >= 0) {
      log('Focus engine: message closed, restoring focus')
      setTimeout(() => {
        const freshItems = getMessageItems()
        const currentIdx = getCursorIndex()
        if (currentIdx >= 0 && currentIdx < freshItems.length) {
          const item = freshItems[currentIdx] as HTMLElement
          item.focus()
          item.classList.add('pf-cursor')
        }
      }, getRestoreDelay())
    }
    lastMessageOpenState = isOpen
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Route change detection (Proton uses pushState/replaceState/popstate navigation)
  const originalPushState = history.pushState.bind(history)
  history.pushState = function (...args) {
    originalPushState(...args)
    setTimeout(() => {
      setCursor(-1)
      log('Focus engine: pushState, cursor reset')
    }, getRestoreDelay())
  }

  const originalReplaceState = history.replaceState.bind(history)
  history.replaceState = function (...args) {
    originalReplaceState(...args)
    setTimeout(() => {
      setCursor(-1)
      log('Focus engine: replaceState, cursor reset')
    }, getRestoreDelay())
  }

  window.addEventListener('popstate', () => {
    setTimeout(() => {
      setCursor(-1)
      log('Focus engine: popstate, cursor reset')
    }, getRestoreDelay())
  })

  // Visibility change: when user comes back to tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const idx = getCursorIndex()
      if (idx >= 0) {
        setTimeout(() => {
          const items = getMessageItems()
          if (idx < items.length) {
            const item = items[idx] as HTMLElement
            item.classList.add('pf-cursor')
          }
        }, 100)
      }
    }
  })

  return {
    destroy() {
      clearInterval(highlightInterval)
      observer.disconnect()
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    },
  }
}
