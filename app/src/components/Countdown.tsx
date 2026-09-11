import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import AmbientLayer from './AmbientLayer'
import Sparkles from './Sparkles'

type Props = { onDone: () => void }

/** intro → 3 → 2 → 1 → ready → (hand off) */
const SEQUENCE = ['intro', '3', '2', '1', 'ready'] as const
type Step = (typeof SEQUENCE)[number]

const HOLD: Record<Step, number> = {
  intro: 1900,
  '3': 950,
  '2': 950,
  '1': 950,
  ready: 1250,
}

export default function Countdown({ onDone }: Props) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const step = SEQUENCE[i]

  useEffect(() => {
    const ms = reduce ? Math.min(HOLD[step], 600) : HOLD[step]
    const id = window.setTimeout(() => {
      if (i === SEQUENCE.length - 1) onDone()
      else setI((v) => v + 1)
    }, ms)
    return () => window.clearTimeout(id)
  }, [i, step, reduce, onDone])

  const isNumber = step === '3' || step === '2' || step === '1'

  return (
    <motion.section
      className="relative flex h-app w-full items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'linear-gradient(165deg, #2B3A67 0%, #4C5A9E 30%, #8E6FA8 62%, #C7749E 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AmbientLayer tone="night" />

      {/* pulsing halo behind the digit */}
      {isNumber && !reduce && (
        <motion.div
          key={`halo-${step}`}
          className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(255,182,217,.55), rgba(142,216,255,.22) 50%, transparent 72%)',
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.35, opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
        />
      )}

      <div className="relative z-10 flex min-h-[9rem] items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.p
              key="intro"
              className="max-w-md font-display text-2xl italic leading-relaxed text-white/95 sm:text-3xl text-glow-soft"
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {birthday.countdownIntro}
            </motion.p>
          )}

          {isNumber && (
            <motion.div key={step} className="relative">
              <Sparkles count={12} size={22} seed={Number(step) * 7} className="-inset-16" />
              <motion.span
                className="block font-display text-[9rem] leading-none text-white sm:text-[12rem]"
                style={{
                  textShadow:
                    '0 0 30px rgba(255,255,255,.85), 0 0 80px rgba(255,182,217,.9), 0 0 140px rgba(142,216,255,.6)',
                }}
                initial={{ opacity: 0, scale: 0.35 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.35, 1.12, 1.02, 1.5] }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{
                  duration: reduce ? 0.5 : 0.95,
                  times: [0, 0.3, 0.7, 1],
                  ease: 'easeOut',
                }}
              >
                {step}
              </motion.span>
            </motion.div>
          )}

          {step === 'ready' && (
            <motion.p
              key="ready"
              className="font-display text-5xl text-white sm:text-6xl text-glow-soft"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {birthday.countdownOutro}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* flash out into the photo reveal */}
      <AnimatePresence>
        {step === 'ready' && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 1.25, times: [0, 0.55, 1], ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}
