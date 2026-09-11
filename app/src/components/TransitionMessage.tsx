import { motion } from 'framer-motion'
import { birthday } from '../data/birthday'

/** Quiet breath between the photo and the timeline — lines fade in one by one. */
export default function TransitionMessage() {
  return (
    <section className="relative flex min-h-[70svh] w-full items-center justify-center px-6 py-24">
      <div className="relative z-10 max-w-lg text-center">
        {birthday.transitionLines.map((line, i) => (
          <motion.p
            key={line}
            className={
              i === 0
                ? 'font-display text-2xl italic text-ink/75 sm:text-3xl'
                : 'mt-3 font-display text-2xl italic text-blush-deep sm:text-3xl'
            }
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: i * 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          className="mx-auto mt-10 h-[2px] w-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #FFB6D9, #8ED8FF, transparent)',
          }}
          whileInView={{ width: '70%' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  )
}
