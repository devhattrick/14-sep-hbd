import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useReducedMotion } from 'framer-motion'

const COLORS = ['#8ED8FF', '#FFB6D9', '#FF5C9A', '#FFFFFF', '#FFE3F1', '#C9A7FF']
const HEART = confetti.shapeFromText
  ? confetti.shapeFromText({ text: '💗', scalar: 2 })
  : undefined

type Props = {
  /** Runs the celebration burst + a gentle drizzle while true. */
  active: boolean
  /** Bump this number to fire an extra one-off burst (used by the easter egg). */
  burstKey?: number
  /** Where a one-off burst originates, in 0–1 viewport coords. */
  burstOrigin?: { x: number; y: number }
}

/** Opening cannon + slow drizzle, plus on-demand bursts. */
export default function Confetti({ active, burstKey = 0, burstOrigin }: Props) {
  const reduce = useReducedMotion()
  const timers = useRef<number[]>([])

  /* main celebration */
  useEffect(() => {
    if (!active || reduce) return
    const small = window.innerWidth < 768
    const base = small ? 55 : 110

    const fire = (originX: number, angle: number, count: number) =>
      confetti({
        particleCount: count,
        angle,
        spread: 68,
        startVelocity: small ? 42 : 55,
        decay: 0.91,
        gravity: 1.05,
        scalar: small ? 0.85 : 1,
        ticks: 220,
        origin: { x: originX, y: 0.72 },
        colors: COLORS,
        disableForReducedMotion: true,
      })

    // opening cannons from both corners
    fire(0.03, 62, base)
    fire(0.97, 118, base)
    timers.current.push(
      window.setTimeout(() => {
        fire(0.12, 70, Math.round(base * 0.7))
        fire(0.88, 110, Math.round(base * 0.7))
      }, 420),
    )

    // slow drizzle of hearts + paper from the top
    const drizzle = window.setInterval(() => {
      if (document.hidden) return
      confetti({
        particleCount: small ? 3 : 6,
        startVelocity: 0,
        gravity: 0.42,
        ticks: small ? 260 : 340,
        scalar: small ? 0.9 : 1.15,
        spread: 90,
        origin: { x: Math.random(), y: -0.08 },
        colors: COLORS,
        shapes: HEART ? ([HEART, 'circle', 'square'] as never) : undefined,
        disableForReducedMotion: true,
      })
    }, 620)

    return () => {
      window.clearInterval(drizzle)
      timers.current.forEach(window.clearTimeout)
      timers.current = []
      confetti.reset()
    }
  }, [active, reduce])

  /* one-off bursts (easter egg) */
  useEffect(() => {
    if (!burstKey || reduce) return
    const origin = burstOrigin ?? { x: 0.5, y: 0.5 }
    confetti({
      particleCount: 44,
      spread: 360,
      startVelocity: 26,
      gravity: 0.6,
      decay: 0.9,
      ticks: 140,
      scalar: 1.1,
      origin,
      colors: COLORS,
      shapes: HEART ? ([HEART, 'circle'] as never) : undefined,
      disableForReducedMotion: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey])

  return null
}
