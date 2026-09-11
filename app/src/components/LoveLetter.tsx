import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import Sparkles from './Sparkles'

/** Second envelope: tap to open, then the message arrives line by line. */
export default function LoveLetter() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const { lead, cta, body, signature } = birthday.letter

  /* The opened letter is taller than the envelope — bring it into view. */
  const openLetter = useCallback(() => {
    setOpen(true)
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      })
    }, 120)
  }, [reduce])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-app w-full flex-col items-center justify-center px-6 py-20"
    >
      <div className="relative z-10 mb-10 text-center">
        {lead.map((line, i) => (
          <motion.p
            key={line}
            className={
              i === 0
                ? 'font-display text-2xl italic text-ink/70'
                : 'mt-1.5 font-display text-2xl italic text-blush-deep'
            }
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.4 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="closed"
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              type="button"
              onClick={openLetter}
              className="relative mb-8 block"
              style={{ width: 'min(230px, 62vw)', aspectRatio: '3 / 2' }}
              whileHover={reduce ? {} : { scale: 1.05, rotate: -1.5 }}
              whileTap={{ scale: 0.97 }}
              animate={reduce ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              aria-label={cta}
            >
              <div
                className="pointer-events-none absolute -inset-8 rounded-[36px] blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,182,217,.8), transparent 70%)',
                }}
              />
              <Sparkles count={6} size={16} seed={13} className="-inset-5" />

              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(150deg,#FFFFFF,#FFDCEE)',
                  boxShadow: '0 22px 50px -22px rgba(159,78,122,.6)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 62%)',
                  background: 'linear-gradient(180deg,#FFF6FB,#FFCDE6)',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <span
                className="absolute left-1/2 top-[52%] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-base"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #FF7FB4, #E13D7E)',
                  boxShadow: '0 6px 16px -6px rgba(225,61,126,.85)',
                }}
              >
                💗
              </span>
            </motion.button>

            <motion.button
              type="button"
              className="btn-primary"
              onClick={openLetter}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {cta}
            </motion.button>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            className="glass relative z-10 w-full max-w-lg rounded-[28px] px-7 py-10 shadow-[0_30px_70px_-30px_rgba(140,70,110,.7)] sm:px-10"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles count={7} size={16} seed={21} className="-inset-4" />

            <div
              className="mx-auto mb-7 h-[2px] w-16 rounded-full"
              style={{ background: 'linear-gradient(90deg,#8ED8FF,#FF5C9A)' }}
            />

            {body.map((para, i) => (
              <motion.p
                key={i}
                className={`whitespace-pre-line text-center leading-[2] ${
                  i === 0
                    ? 'font-display text-xl text-blush-deep'
                    : 'mt-5 font-body text-[15px] text-ink/80'
                }`}
                initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: reduce ? 0.25 : 0.8,
                  delay: reduce ? i * 0.05 : 0.35 + i * 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {para}
              </motion.p>
            ))}

            <motion.p
              className="mt-9 text-center font-script text-2xl text-blush-deep"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: reduce ? 0.5 : 0.35 + body.length * 0.6 }}
            >
              {signature}
            </motion.p>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  )
}
