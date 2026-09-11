import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { birthday, type Memory } from '../data/birthday'
import { withBase } from '../lib/hooks'
import Sparkles from './Sparkles'

/**
 * Vertical timeline. The connecting line draws itself from the scroll
 * progress of the section; each memory animates in on its own as it arrives.
 */
export default function Timeline() {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 78%', 'end 62%'],
  })
  const drawn = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <section className="relative w-full px-5 py-16 sm:px-8">
      <header className="relative z-10 mx-auto mb-14 max-w-2xl text-center">
        <motion.h2
          className="font-display text-4xl sm:text-5xl gradient-text"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {birthday.timelineTitle}
        </motion.h2>
        <motion.p
          className="mt-3 font-body text-sm text-ink/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          {birthday.timelineSubtitle}
        </motion.p>
      </header>

      <div ref={ref} className="relative mx-auto max-w-4xl">
        {/* rail: left on mobile, centred on desktop */}
        <div
          className="absolute bottom-0 top-0 w-[2px] rounded-full bg-blush-soft/25
                     left-[13px] md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        />
        <motion.div
          className="absolute top-0 w-[2px] origin-top rounded-full
                     left-[13px] md:left-1/2 md:-translate-x-1/2"
          style={{
            height: '100%',
            scaleY: reduce ? 1 : drawn,
            background: 'linear-gradient(180deg, #8ED8FF, #FFB6D9 55%, #FF5C9A)',
            boxShadow: '0 0 14px rgba(255,140,190,.55)',
          }}
          aria-hidden
        />

        <ol className="relative space-y-12 md:space-y-20">
          {birthday.timeline.map((item, i) => (
            <TimelineItem key={item.title} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function TimelineItem({ item, index }: { item: Memory; index: number }) {
  const reduce = useReducedMotion()
  const left = index % 2 === 0

  return (
    <li className="relative pl-12 md:pl-0">
      {/* node */}
      <motion.span
        className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full text-[13px]
                   left-0 top-1 md:left-1/2 md:-translate-x-1/2"
        style={{
          background: 'linear-gradient(140deg,#FFFFFF,#FFE3F1)',
          boxShadow: '0 0 0 4px rgba(255,255,255,.75), 0 6px 16px -6px rgba(255,92,154,.7)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        {item.emoji ?? '💗'}
      </motion.span>

      <motion.article
        className={`relative md:w-[46%] ${left ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduce ? 0.3 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass overflow-hidden rounded-3xl shadow-[0_20px_50px_-26px_rgba(140,70,110,.6)]">
          <div className="relative overflow-hidden">
            <motion.img
              src={withBase(item.image)}
              alt={item.title}
              loading="lazy"
              className="block h-52 w-full object-cover sm:h-60"
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduce ? 0.3 : 1.2, ease: [0.16, 1, 0.3, 1] }}
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(43,27,41,.35), transparent 55%)',
              }}
            />
            <Sparkles count={4} size={14} seed={index * 5 + 2} />

            <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.14em] text-blush-deep backdrop-blur">
              {item.date}
            </span>
          </div>

          <div className="px-5 pb-6 pt-4">
            <h3 className="font-display text-xl text-ink">{item.title}</h3>
            <p className="mt-2 whitespace-pre-line font-body text-[13.5px] leading-relaxed text-ink/65">
              {item.description}
            </p>
          </div>
        </div>
      </motion.article>
    </li>
  )
}
