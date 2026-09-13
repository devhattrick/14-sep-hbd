import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'

type Props = {
  open: boolean
  onClose: () => void
}

/** Revealed after tapping five drifting hearts. Heart burst + tiny confetti. */
export default function EasterEgg({ open, onClose }: Props) {
  const reduce = useReducedMotion()
  const burst = Array.from({ length: reduce ? 0 : 14 }, (_, i) => i)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(40,20,40,.5)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          />

          {/* heart burst */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {burst.map((i) => {
              const angle = (Math.PI * 2 * i) / burst.length
              const dist = 130 + (i % 4) * 34
              return (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.2, 0.6],
                    rotate: (i % 2 ? 1 : -1) * 40,
                  }}
                  transition={{ duration: 1.5, delay: (i % 5) * 0.05, ease: 'easeOut' }}
                >
                  {i % 3 === 0 ? '✨' : '💗'}
                </motion.span>
              )
            })}
          </div>

          <motion.div
            className="relative z-10 max-w-sm rounded-3xl bg-white/92 px-8 py-10 text-center shadow-2xl backdrop-blur-xl"
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.p
              className="text-5xl"
              animate={reduce ? {} : { scale: [1, 1.18, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              💗
            </motion.p>
            <h3 className="mt-5 font-display text-2xl text-blush-deep">
              {birthday.easterEgg.message}
            </h3>
            <p className="mt-3 font-body text-sm text-blush-deep/80">
              {birthday.easterEgg.submessage}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-white/70 px-6 py-3 font-body text-sm font-medium text-blush-deep transition hover:bg-white"
            >
              ปิดหน้าต่างนี้
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
