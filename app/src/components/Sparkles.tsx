import { memo, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Props = {
  count?: number
  /** px — sparkles scatter inside the parent's box, this scales them. */
  size?: number
  color?: string
  seed?: number
  className?: string
}

const STAR =
  'M12 0 L14.2 8.4 L22.6 10.6 L14.2 12.8 L12 21.2 L9.8 12.8 L1.4 10.6 L9.8 8.4 Z'

/** Four-point sparkles that pop in and out around a photo, cake or heading. */
function SparklesBase({
  count = 10,
  size = 16,
  color = '#FFF3FA',
  seed = 3,
  className = '',
}: Props) {
  const reduce = useReducedMotion()

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const k = i + seed
        return {
          id: i,
          top: (k * 53) % 100,
          left: (k * 71) % 100,
          scale: 0.5 + ((k * 13) % 60) / 100,
          delay: ((k * 29) % 45) / 10,
          duration: 2 + ((k * 17) % 25) / 10,
        }
      }),
    [count, seed],
  )

  if (reduce) return null

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      aria-hidden
    >
      {items.map((s) => (
        <motion.svg
          key={s.id}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,.9))',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, s.scale, 0],
            rotate: [0, 90],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 1.1,
            ease: 'easeInOut',
          }}
        >
          <path d={STAR} fill={color} />
        </motion.svg>
      ))}
    </div>
  )
}

export const Sparkles = memo(SparklesBase)
export default Sparkles
