import { memo, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIsSmallScreen } from '../lib/hooks'

type Props = {
  /** 'light' for the pastel stages, 'night' for cake + finale. */
  tone?: 'light' | 'night'
  /** Soft rising bubbles — nice on the envelope stage, noisy everywhere else. */
  bubbles?: boolean
}

/** Tiny twinkling stars + optional bubbles. Pure CSS/transform, no canvas. */
function AmbientLayerBase({ tone = 'light', bubbles = false }: Props) {
  const reduce = useReducedMotion()
  const small = useIsSmallScreen()

  const stars = useMemo(() => {
    const n = small ? 22 : 40
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      top: (i * 47) % 100,
      left: (i * 29) % 100,
      size: 1.5 + ((i * 11) % 25) / 10,
      delay: ((i * 31) % 40) / 10,
      duration: 2.4 + ((i * 7) % 30) / 10,
    }))
  }, [small])

  const bubbleField = useMemo(() => {
    if (!bubbles) return []
    const n = small ? 6 : 11
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: 3 + ((i * 41) % 94),
      size: 16 + ((i * 23) % 46),
      delay: (i * 2.1) % 14,
      duration: 16 + ((i * 5) % 10),
    }))
  }, [bubbles, small])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* soft glow blobs */}
      <div
        className="absolute -left-[15%] top-[8%] h-[46vmin] w-[46vmin] rounded-full blur-[70px]"
        style={{
          background:
            tone === 'night'
              ? 'radial-gradient(circle, rgba(255,92,154,.30), transparent 68%)'
              : 'radial-gradient(circle, rgba(142,216,255,.55), transparent 68%)',
        }}
      />
      <div
        className="absolute -right-[12%] bottom-[6%] h-[52vmin] w-[52vmin] rounded-full blur-[80px]"
        style={{
          background:
            tone === 'night'
              ? 'radial-gradient(circle, rgba(142,120,255,.30), transparent 68%)'
              : 'radial-gradient(circle, rgba(255,182,217,.6), transparent 68%)',
        }}
      />

      {/* twinkling stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={reduce ? '' : 'animate-twinkle'}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '9999px',
            background: tone === 'night' ? '#ffffff' : '#ffffff',
            opacity: reduce ? 0.4 : undefined,
            boxShadow:
              tone === 'night'
                ? '0 0 8px 1px rgba(255,255,255,.9)'
                : '0 0 6px 1px rgba(255,255,255,.85)',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* bubbles */}
      {bubbleField.map((b) => (
        <motion.span
          key={`b-${b.id}`}
          className="absolute bottom-[-10%] rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,.95), rgba(255,255,255,.10) 60%, rgba(255,255,255,.02))',
            border: '1px solid rgba(255,255,255,.5)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduce
              ? { opacity: 0.35 }
              : { y: ['0vh', '-115vh'], opacity: [0, 0.65, 0.65, 0] }
          }
          transition={
            reduce
              ? { duration: 0.3 }
              : {
                  duration: b.duration,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.18, 0.82, 1],
                }
          }
        />
      ))}
    </div>
  )
}

export const AmbientLayer = memo(AmbientLayerBase)
export default AmbientLayer
