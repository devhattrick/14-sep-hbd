import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import Sparkles from './Sparkles'

type Props = { onDone: () => void }

/** lit → blown (flames out) → hush (1s of quiet) → wish → hope → hands off */
type Phase = 'lit' | 'blown' | 'hush' | 'wish' | 'hope'

const NEXT: Record<Phase, { next: Phase | 'done'; ms: number }> = {
  lit: { next: 'lit', ms: 0 },
  blown: { next: 'hush', ms: 900 },
  hush: { next: 'wish', ms: 1000 },
  wish: { next: 'hope', ms: 2200 },
  hope: { next: 'done', ms: 2600 },
}

export default function BirthdayCake({ onDone }: Props) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('lit')
  const { lead, wishTitle, cta, candles, afterBlow } = birthday.cake

  useEffect(() => {
    if (phase === 'lit') return
    const { next, ms } = NEXT[phase]
    const id = window.setTimeout(
      () => (next === 'done' ? onDone() : setPhase(next)),
      reduce ? Math.min(ms, 700) : ms,
    )
    return () => window.clearTimeout(id)
  }, [phase, reduce, onDone])

  const lit = phase === 'lit'
  const dimmed = phase !== 'lit'

  const candleList = useMemo(
    () =>
      Array.from({ length: Math.max(1, candles) }, (_, i) => ({
        id: i,
        delay: i * 0.13,
      })),
    [candles],
  )

  return (
    <section className="relative flex min-h-app w-full flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* the room dims once the candles go out */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[5] bg-[#1B1030]"
        initial={{ opacity: 0 }}
        animate={{ opacity: dimmed ? 0.55 : 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />

      <motion.p
        className={`relative z-10 mb-10 font-display text-2xl italic sm:text-3xl ${
          dimmed ? 'text-white/85' : 'text-ink/70'
        }`}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9 }}
      >
        {lead}
      </motion.p>

      {/* ── Cake ─────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 46, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduce ? 0.35 : 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {/* warm candle glow */}
        <motion.div
          className="pointer-events-none absolute -inset-16 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(255,214,140,.75), rgba(255,182,217,.4) 50%, transparent 72%)',
          }}
          animate={{ opacity: lit ? [0.75, 1, 0.75] : 0.12 }}
          transition={
            lit
              ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.2 }
          }
        />

        {lit && <Sparkles count={8} size={16} seed={31} className="-inset-10" />}

        <div className="relative" style={{ width: 'min(260px, 68vw)' }}>
          {/* candles */}
          <div className="relative z-20 mb-1 flex items-end justify-center gap-3">
            {candleList.map((c) => (
              <div key={c.id} className="relative flex flex-col items-center">
                {/* flame */}
                <AnimatePresence>
                  {lit && (
                    <motion.span
                      className={`relative mb-1 block ${reduce ? '' : 'animate-flicker'}`}
                      style={{
                        width: 11,
                        height: 18,
                        borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
                        background:
                          'radial-gradient(ellipse at 50% 72%, #FFF6D6 0%, #FFD166 42%, #FF8A3D 78%, rgba(255,120,60,0) 100%)',
                        boxShadow: '0 0 16px 5px rgba(255,190,90,.75)',
                        animationDelay: `${c.delay}s`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scaleY: 0.1, scaleX: 1.6, opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>

                {/* smoke puff after blowing */}
                <AnimatePresence>
                  {phase === 'blown' && !reduce && (
                    <motion.span
                      className="absolute -top-2 h-2 w-2 rounded-full bg-white/50 blur-[2px]"
                      initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
                      animate={{ opacity: 0, y: -34, scale: 2.1, x: c.id % 2 ? 8 : -8 }}
                      transition={{ duration: 1.4, ease: 'easeOut', delay: c.delay * 0.5 }}
                    />
                  )}
                </AnimatePresence>

                {/* wick + stick */}
                <span className="h-[3px] w-[2px] bg-[#5B4636]" />
                <span
                  className="block w-[9px] rounded-sm"
                  style={{
                    height: 34,
                    background:
                      'repeating-linear-gradient(135deg,#FFFFFF 0 5px,#FF8FC0 5px 10px)',
                    boxShadow: 'inset -2px 0 0 rgba(0,0,0,.06)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* cake body — SVG so the frosting drips are real scallops */}
          <CakeBody />
        </div>
      </motion.div>

      {/* ── Wish + button / after-messages ───────────────────── */}
      <div className="relative z-10 mt-12 flex min-h-[9.5rem] flex-col items-center justify-start text-center">
        <AnimatePresence mode="wait">
          {lit && (
            <motion.div
              key="ask"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="mb-6 font-display text-4xl gradient-text sm:text-5xl">
                {wishTitle}
              </h2>
              <motion.button
                type="button"
                className="btn-primary"
                onClick={() => setPhase('blown')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  reduce
                    ? {}
                    : {
                        boxShadow: [
                          '0 10px 30px -8px rgba(255,92,154,.5)',
                          '0 14px 44px -6px rgba(255,92,154,.85)',
                          '0 10px 30px -8px rgba(255,92,154,.5)',
                        ],
                      }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {cta}
              </motion.button>
            </motion.div>
          )}

          {phase === 'wish' && (
            <motion.p
              key="wish"
              className="font-display text-3xl italic text-white sm:text-4xl text-glow-soft"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {afterBlow[0]}
            </motion.p>
          )}

          {phase === 'hope' && (
            <motion.p
              key="hope"
              className="font-display text-3xl italic text-white sm:text-4xl text-glow-soft"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {afterBlow[1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** Scallops walking leftwards, used for both frosting drips. */
function scallops(count: number, width: number) {
  const w = width / count
  return Array.from({ length: count }, () => `q ${-w / 2} 14 ${-w} 0`).join(' ')
}

const TOP_FROSTING = `M 52 0 H 148 V 30 ${scallops(6, 96)} Z`
const BOTTOM_FROSTING = `M 20 48 H 180 V 74 ${scallops(8, 160)} Z`

const SPRINKLES = [
  { x: 66, y: 40, c: '#FF5C9A', r: 18 },
  { x: 100, y: 43, c: '#8ED8FF', r: -24 },
  { x: 132, y: 39, c: '#FFD166', r: 42 },
  { x: 38, y: 88, c: '#8ED8FF', r: 12 },
  { x: 66, y: 94, c: '#FFD166', r: -38 },
  { x: 100, y: 87, c: '#FF5C9A', r: 26 },
  { x: 134, y: 95, c: '#8ED8FF', r: -14 },
  { x: 162, y: 88, c: '#FF5C9A', r: 34 },
]

/** Two-tier cake drawn as SVG: crisp drips at any size, one paint layer. */
function CakeBody() {
  return (
    <svg
      viewBox="0 0 200 124"
      className="block w-full"
      style={{ filter: 'drop-shadow(0 18px 26px rgba(120,60,95,.34))' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="cakeTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDFE" />
          <stop offset="100%" stopColor="#FFE4F1" />
        </linearGradient>
        <linearGradient id="cakeBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF2F8" />
          <stop offset="100%" stopColor="#FFC4E0" />
        </linearGradient>
        <linearGradient id="frostTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFEEFF" />
          <stop offset="100%" stopColor="#7FCDF5" />
        </linearGradient>
        <linearGradient id="frostBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB9DA" />
          <stop offset="100%" stopColor="#FF6FAE" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E4D0DE" />
        </linearGradient>
      </defs>

      {/* plate */}
      <ellipse cx="100" cy="110" rx="95" ry="7" fill="url(#plate)" />

      {/* bottom tier */}
      <rect x="20" y="48" width="160" height="62" rx="4" fill="url(#cakeBottom)" />
      <path d={BOTTOM_FROSTING} fill="url(#frostBottom)" />

      {/* top tier */}
      <rect x="52" y="0" width="96" height="48" fill="url(#cakeTop)" />
      <path d={TOP_FROSTING} fill="url(#frostTop)" />

      {/* sprinkles */}
      {SPRINKLES.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width="5.5"
          height="2.4"
          rx="1.2"
          fill={s.c}
          transform={`rotate(${s.r} ${s.x + 2.75} ${s.y + 1.2})`}
        />
      ))}

      {/* soft shading so the tiers read as round */}
      <rect x="20" y="48" width="160" height="62" rx="4" fill="url(#tierShade)" />
      <defs>
        <linearGradient id="tierShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(150,80,120,.16)" />
          <stop offset="18%" stopColor="rgba(150,80,120,0)" />
          <stop offset="82%" stopColor="rgba(150,80,120,0)" />
          <stop offset="100%" stopColor="rgba(150,80,120,.16)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
