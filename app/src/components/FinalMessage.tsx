import { motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import AmbientLayer from './AmbientLayer'
import FloatingHearts from './FloatingHearts'
import Fireworks from './Fireworks'
import Confetti from './Confetti'
import Sparkles from './Sparkles'
import ReplayButton from './ReplayButton'

type Props = {
  onReplay: () => void
  onHeartTap: () => void
}

/** The peak: night sky, fireworks, confetti, and the big message. */
export default function FinalMessage({ onReplay, onHeartTap }: Props) {
  const reduce = useReducedMotion()
  const { title, subtitle, date, lines, signature } = birthday.finale

  // beat timings (seconds) — everything is chained off these
  const t = reduce
    ? { title: 0.1, sub: 0.2, date: 0.3, lines: 0.4, sign: 0.6, replay: 0.7 }
    : { title: 0.7, sub: 1.6, date: 2.2, lines: 2.9, sign: 5.0, replay: 5.8 }

  return (
    <motion.section
      className="relative flex min-h-app w-full flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{
        background:
          'linear-gradient(170deg, #16143C 0%, #2E1F5E 28%, #5B2E7A 58%, #A8437F 82%, #E86FA0 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1 }}
    >
      <AmbientLayer tone="night" />
      <Fireworks active />
      <Confetti active />
      <FloatingHearts tone="night" onHeartTap={onHeartTap} density={reduce ? 4 : 10} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          <Sparkles count={10} size={20} seed={41} className="-inset-10" />
          <motion.h1
            className="font-display text-[3.2rem] leading-[1.05] text-white sm:text-8xl"
            style={{
              textShadow:
                '0 0 26px rgba(255,255,255,.6), 0 0 70px rgba(255,140,190,.85), 0 0 140px rgba(142,216,255,.55)',
            }}
            initial={{ opacity: 0, y: 34, scale: 0.9, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: reduce ? 0.4 : 1.4, delay: t.title, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h1>
        </div>

        <motion.p
          className="mt-4 font-script text-3xl text-blush-soft sm:text-4xl"
          style={{ textShadow: '0 0 24px rgba(255,182,217,.75)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: t.sub }}
        >
          {subtitle}
        </motion.p>

        <motion.p
          className="mt-3 font-body text-[11px] uppercase tracking-[0.45em] text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: t.date }}
        >
          {date}
        </motion.p>

        <motion.div
          className="mt-8 h-[2px] w-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #FFB6D9, #8ED8FF, transparent)',
          }}
          animate={{ width: 220 }}
          transition={{ duration: 1.3, delay: t.date + 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="mt-8 max-w-md space-y-5">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className="whitespace-pre-line font-body text-[15px] leading-[2] text-white/90 sm:text-base"
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: reduce ? 0.3 : 1,
                delay: t.lines + i * (reduce ? 0.1 : 1.1),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="mt-10 font-script text-2xl text-white/85"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: t.sign }}
        >
          {signature}
        </motion.p>

        <div className="mt-9 safe-b">
          <ReplayButton onReplay={onReplay} delay={t.replay} />
        </div>
      </div>
    </motion.section>
  )
}
