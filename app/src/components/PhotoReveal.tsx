import { motion, useReducedMotion } from "framer-motion";
import { birthday } from "../data/birthday";
import Sparkles from "./Sparkles";

/**
 * First full-screen beat after the countdown: the photo un-blurs while three
 * lines land one after another.
 */
export default function PhotoReveal() {
  const reduce = useReducedMotion();
  const { line1, line2, line3 } = birthday.photoReveal;

  return (
    <section className="relative flex min-h-app w-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      <motion.div
        // width is also capped against viewport height so the 4:5 frame plus the
        // headings always fit above the fold, even on short landscape screens
        className="relative z-10 w-full"
        style={{ width: "min(400px, 82vw, 44svh)" }}
        initial={{ opacity: 0, scale: 1.06, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          duration: reduce ? 0.4 : 1.6,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
      >
        <Sparkles count={10} size={20} seed={9} className="-inset-8" />

        {/* glow behind the frame */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-[44px] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,182,217,.75), rgba(142,216,255,.4) 55%, transparent 75%)",
          }}
        />

        <motion.div
          className="glass relative overflow-hidden rounded-[28px] p-2.5 shadow-[0_30px_70px_-30px_rgba(140,70,110,.7)]"
          animate={reduce ? {} : { y: [0, -9, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative overflow-hidden rounded-[20px]">
            <motion.img
              src={birthday.mainPhoto}
              alt={`รูปของ ${birthday.name}`}
              className="block h-full w-full object-cover"
              style={{ aspectRatio: "4 / 5" }}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{
                duration: reduce ? 0.4 : 2.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              draggable={false}
            />
            {/* darken → clear */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[#2B1B29]"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.4 : 1.8, delay: 0.25 }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(43,27,41,.42) 0%, transparent 42%)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Lines ─────────────────────────────────────────────── */}
      <div className="relative z-10 mt-7 flex flex-col items-center text-center sm:mt-9">
        <motion.p
          className="font-body text-sm tracking-[0.18em] text-ink/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduce ? 0.2 : 1.5 }}
        >
          {line1}
        </motion.p>

        <motion.h1
          className="my-2 font-display text-[2.2rem] leading-[1.12] sm:mt-3 sm:text-6xl gradient-text"
          initial={{ opacity: 0, y: 22, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: reduce ? 0.3 : 2.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {line2}
        </motion.h1>

        <motion.p
          className="mt-3 font-body text-[11px] uppercase tracking-[0.42em] text-blush-deep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: reduce ? 0.4 : 2.7 }}
        >
          {line3}
        </motion.p>
      </div>

      {/* scroll hint */}
      <motion.div
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0.6 : 3.4 }}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-ink/45">
          scroll
        </span>
        <motion.span
          className="text-blush-deep"
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
