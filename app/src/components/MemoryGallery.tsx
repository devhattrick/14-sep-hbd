import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'

/** Masonry-ish grid of little moments with a blurred full-screen lightbox. */
export default function MemoryGallery() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const photos = birthday.gallery

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open, close, step])

  return (
    <section className="relative w-full px-5 py-16 sm:px-8">
      <header className="relative z-10 mx-auto mb-10 max-w-2xl text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl gradient-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {birthday.galleryTitle}
        </motion.h2>
        <motion.p
          className="mt-2.5 font-body text-sm text-ink/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {birthday.gallerySubtitle}
        </motion.p>
      </header>

      <div className="mx-auto max-w-4xl columns-2 gap-3 sm:columns-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {photos.map((p, i) => (
          <motion.button
            key={p.image + i}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl
                       shadow-[0_14px_36px_-20px_rgba(140,70,110,.65)]"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: reduce ? 0.3 : 0.7,
              delay: reduce ? 0 : (i % 3) * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`ดูรูป: ${p.caption}`}
          >
            <img
              src={p.image}
              alt={p.caption}
              loading="lazy"
              className="block w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              draggable={false}
            />
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(to top, rgba(43,27,41,.6), transparent 55%)',
              }}
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left font-body text-[12px] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {p.caption}
            </span>
          </motion.button>
        ))}
      </div>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={photos[open].caption}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(38,22,36,.68)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
              }}
            />

            <motion.figure
              className="relative z-10 max-h-full w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[open].image}
                alt={photos[open].caption}
                className="mx-auto max-h-[72svh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                draggable={false}
              />
              <figcaption className="mt-4 text-center font-display text-lg italic text-white/95">
                {photos[open].caption}
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={close}
              aria-label="ปิด"
              className="glass-dark absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white"
              style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
            >
              ✕
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  aria-label="รูปก่อนหน้า"
                  className="glass-dark absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  aria-label="รูปถัดไป"
                  className="glass-dark absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white"
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
