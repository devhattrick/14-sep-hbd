import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import AmbientLayer from './AmbientLayer'
import FloatingHearts from './FloatingHearts'
import Sparkles from './Sparkles'

type Props = {
  onOpened: () => void
  onHeartTap: () => void
}

/** idle → lift (button out, envelope grows) → flap → paper → flash → done */
type Phase = 'idle' | 'lift' | 'flap' | 'paper' | 'flash'

const STEPS: Record<Exclude<Phase, 'idle'>, number> = {
  lift: 520,
  flap: 780,
  paper: 900,
  flash: 620,
}

export default function EnvelopeIntro({ onOpened, onHeartTap }: Props) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')

  /* Chain the opening beats. Reduced motion collapses them into one short cut. */
  useEffect(() => {
    if (phase === 'idle') return
    const next: Record<string, Phase | 'done'> = {
      lift: 'flap',
      flap: 'paper',
      paper: 'flash',
      flash: 'done',
    }
    const ms = reduce ? 220 : STEPS[phase as Exclude<Phase, 'idle'>]
    const id = window.setTimeout(() => {
      const n = next[phase]
      if (n === 'done') onOpened()
      else setPhase(n as Phase)
    }, ms)
    return () => window.clearTimeout(id)
  }, [phase, reduce, onOpened])

  const opening = phase !== 'idle'
  const flapOpen = phase === 'flap' || phase === 'paper' || phase === 'flash'
  const paperOut = phase === 'paper' || phase === 'flash'

  return (
    <motion.section
      className="relative flex h-app w-full flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'linear-gradient(160deg, #8ED8FF 0%, #BFE6FF 32%, #FFE1F0 68%, #FFB6D9 100%)',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AmbientLayer tone="light" bubbles />
      <FloatingHearts tone="light" onHeartTap={onHeartTap} />

      {/* ── Envelope ─────────────────────────────────────────── */}
      <motion.div
        className="relative z-10"
        style={{ perspective: 1400 }}
        animate={
          reduce
            ? {}
            : opening
              ? { y: 0, scale: phase === 'flash' ? 1.02 : 1.06 }
              : { y: [0, -14, 0] }
        }
        transition={
          opening
            ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.div
          className="relative"
          style={{
            width: 'min(330px, 76vw)',
            aspectRatio: '3 / 2',
            transformStyle: 'preserve-3d',
          }}
          whileHover={reduce || opening ? {} : { scale: 1.035, rotate: -1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* glow halo */}
          <div
            className="pointer-events-none absolute -inset-10 rounded-[40px] blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,.85), rgba(255,182,217,.45) 45%, transparent 72%)',
            }}
          />
          <Sparkles count={8} size={18} seed={5} className="-inset-6" />

          {/* back panel — same tone as the front so it reads as one sealed envelope */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(150deg, #FFFBFD 0%, #FFE2F0 100%)',
              boxShadow: '0 26px 60px -22px rgba(159, 78, 122, .55)',
              zIndex: 5,
            }}
          />

          {/* letter paper — tucked fully inside until the flap opens */}
          <motion.div
            className="absolute left-[7%] w-[86%] rounded-lg bg-white px-5 py-5"
            style={{
              height: '94%',
              bottom: '4%',
              boxShadow: '0 14px 34px -14px rgba(120,60,95,.4)',
              // stays tucked behind the back panel until it actually slides out
              zIndex: paperOut ? 25 : 1,
            }}
            initial={false}
            animate={
              paperOut
                ? { y: '-62%', opacity: phase === 'flash' ? 0 : 1, scale: 1 }
                : { y: '0%', opacity: 1, scale: 0.98 }
            }
            transition={{ duration: reduce ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-script text-center text-xl text-blush-deep">
              Dear {birthday.name},
            </p>
            <div className="mt-3 space-y-2">
              {[92, 80, 88, 62].map((w, i) => (
                <div
                  key={i}
                  className="h-[6px] rounded-full"
                  style={{
                    width: `${w}%`,
                    background:
                      'linear-gradient(90deg, rgba(255,182,217,.85), rgba(142,216,255,.7))',
                  }}
                />
              ))}
            </div>
            <p className="mt-5 text-center text-xl">💗</p>
          </motion.div>

          {/* front pocket — its V notch meets the flap tip */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 20,
              clipPath: 'polygon(0% 20%, 50% 58%, 100% 20%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(165deg, #FFFFFF 0%, #FFE7F3 55%, #FFD2E8 100%)',
              borderRadius: 16,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9)',
            }}
          />

          {/* address text sits on the pocket */}
          <div
            className="absolute inset-x-0 bottom-[8%] flex flex-col items-center"
            style={{ zIndex: 21 }}
          >
            <p className="font-display text-[13.5px] tracking-wide text-ink/85">
              {birthday.envelope.to}
            </p>
            <p className="mt-0.5 font-body text-[9px] uppercase tracking-[0.35em] text-blush-deep">
              {birthday.envelope.subtitle}
            </p>
          </div>

          {/* flap */}
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              height: '60%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFDCEE 100%)',
              borderRadius: '16px 16px 0 0',
              filter: 'drop-shadow(0 4px 6px rgba(180,110,150,.18))',
            }}
            initial={false}
            animate={
              flapOpen
                ? { rotateX: -178, zIndex: [30, 5, 5] }
                : { rotateX: 0, zIndex: [30, 30, 30] }
            }
            transition={{
              duration: reduce ? 0.2 : 0.75,
              ease: [0.65, 0, 0.35, 1],
              zIndex: { times: [0, 0.35, 1], duration: reduce ? 0.2 : 0.75 },
            }}
          />

          {/* wax seal, centred on the flap tip */}
          <motion.div
            className="absolute left-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-sm"
            style={{
              top: '57%',
              zIndex: 31,
              marginLeft: -18,
              background: 'radial-gradient(circle at 35% 30%, #FF7FB4, #E13D7E)',
              boxShadow: '0 6px 16px -6px rgba(225,61,126,.8), inset 0 1px 3px rgba(255,255,255,.5)',
            }}
            initial={false}
            animate={
              opening
                ? { scale: 0, opacity: 0, rotate: 40 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            transition={{ duration: 0.35, ease: 'backIn' }}
          >
            💗
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Heading + CTA ────────────────────────────────────── */}
      <AnimatePresence>
        {!opening && (
          <motion.div
            className="relative z-10 mt-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <p className="mb-6 max-w-xs font-display text-lg italic leading-relaxed text-ink/80 drop-shadow-[0_1px_8px_rgba(255,255,255,.9)]">
              A Little Birthday Journey Just For You 💗
            </p>

            <motion.button
              type="button"
              className="btn-primary"
              onClick={() => setPhase('lift')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              animate={
                reduce
                  ? {}
                  : {
                      boxShadow: [
                        '0 10px 30px -8px rgba(255,92,154,.55)',
                        '0 14px 42px -6px rgba(255,92,154,.85)',
                        '0 10px 30px -8px rgba(255,92,154,.55)',
                      ],
                    }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {birthday.envelope.cta}
            </motion.button>

            <p className="mt-4 font-body text-[10px] tracking-[0.3em] text-ink/45">
              TAP TO BEGIN
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* soft white flash into the countdown */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}
