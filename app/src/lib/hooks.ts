import { useEffect, useState } from 'react'

/**
 * Locks `--app-height` to the real visible viewport height.
 * iOS Safari's `100vh` includes the URL bar, which makes every full-screen
 * stage overflow by ~80px. `svh` covers most of it; this covers the rest.
 */
export function useAppHeight() {
  useEffect(() => {
    const set = () => {
      const h = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${h}px`)
    }
    set()
    window.addEventListener('resize', set)
    window.visualViewport?.addEventListener('resize', set)
    return () => {
      window.removeEventListener('resize', set)
      window.visualViewport?.removeEventListener('resize', set)
    }
  }, [])
}

/** Adds/removes `is-locked` on <body> so non-scrolling stages can't be dragged. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.classList.toggle('is-locked', locked)
    return () => document.body.classList.remove('is-locked')
  }, [locked])
}

/** True on coarse-pointer / narrow screens — used to thin out particle counts. */
export function useIsSmallScreen() {
  const [small, setSmall] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setSmall(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return small
}

/** Fires `cb` after `ms`; resets cleanly when deps change. */
export function useTimeout(cb: () => void, ms: number | null) {
  useEffect(() => {
    if (ms === null) return
    const id = window.setTimeout(cb, ms)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms])
}

/** Deterministic-ish random helper so particle fields don't reshuffle on re-render. */
export function seededRandoms(count: number, seed = 1) {
  let s = seed
  return Array.from({ length: count }, () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  })
}
