import { memo, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIsSmallScreen } from '../lib/hooks'

type Props = {
  /** Called when one of the drifting hearts is tapped (drives the easter egg). */
  onHeartTap?: () => void
  /** 'light' = pink/blue on pale bg, 'night' = warm glow on dark bg. */
  tone?: 'light' | 'night'
  density?: number
  className?: string
}

const HEART_PATH =
  'M12 21s-6.7-4.35-9.33-8.06C.62 10.1 1.6 6.3 4.6 5.05c2.1-.87 4.3-.1 5.5 1.6.5.7.7 1.2.9 1.6.2-.4.4-.9.9-1.6 1.2-1.7 3.4-2.47 5.5-1.6 3 1.25 3.98 5.05 1.93 7.89C18.7 16.65 12 21 12 21z'

/**
 * Ambient field of drifting hearts. Every heart is a real button so the
 * hidden "tap 5 hearts" easter egg works with mouse, touch and keyboard.
 */
function FloatingHeartsBase({
  onHeartTap,
  tone = 'light',
  density,
  className = '',
}: Props) {
  const reduce = useReducedMotion()
  const small = useIsSmallScreen()
  const count = density ?? (small ? 8 : 14)

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 4 + ((i * 37) % 92),
        size: 12 + ((i * 13) % 22),
        delay: (i * 1.35) % 12,
        duration: 13 + ((i * 7) % 11),
        drift: i % 2 === 0 ? 26 : -26,
        opacity: 0.22 + ((i * 17) % 30) / 100,
      })),
    [count],
  )

  const fill =
    tone === 'night'
      ? ['#FFB6D9', '#FF9CC8', '#FFD9EC']
      : ['#FFB6D9', '#8ED8FF', '#FF5C9A']

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden={onHeartTap ? undefined : true}
    >
      {hearts.map((h) => (
        <motion.button
          key={h.id}
          type="button"
          tabIndex={-1}
          onClick={onHeartTap}
          aria-label="หัวใจลอย"
          className="pointer-events-auto absolute bottom-[-12%] cursor-pointer border-0 bg-transparent p-2 outline-none"
          style={{ left: `${h.left}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={
            reduce
              ? { y: '-40vh', opacity: h.opacity }
              : {
                  y: ['0vh', '-118vh'],
                  x: [0, h.drift, -h.drift * 0.6, 0],
                  opacity: [0, h.opacity, h.opacity, 0],
                  rotate: [0, h.drift > 0 ? 14 : -14, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0.4 }
              : {
                  duration: h.duration,
                  delay: h.delay,
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.15, 0.85, 1],
                }
          }
          whileTap={{ scale: 1.6 }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={fill[h.id % fill.length]}
            style={{
              filter:
                tone === 'night'
                  ? 'drop-shadow(0 0 8px rgba(255,182,217,.85))'
                  : 'drop-shadow(0 2px 6px rgba(255,92,154,.35))',
            }}
          >
            <path d={HEART_PATH} />
          </svg>
        </motion.button>
      ))}
    </div>
  )
}

export const FloatingHearts = memo(FloatingHeartsBase)
export default FloatingHearts
