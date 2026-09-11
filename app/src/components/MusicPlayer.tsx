import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { birthday } from '../data/birthday'
import { withBase } from '../lib/hooks'

/* ── YouTube IFrame API (minimal typings) ───────────────────── */
type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (v: number) => void
  destroy: () => void
}
declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, opts: Record<string, unknown>) => YTPlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

/** Accepts a full YouTube URL (watch / youtu.be / shorts / embed) or a bare id. */
export function parseYouTubeId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  if (/^[\w-]{11}$/.test(raw)) return raw
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = raw.match(p)
    if (m) return m[1]
  }
  return null
}

let apiPromise: Promise<void> | null = null
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return apiPromise
}

type Props = {
  /** Flips true once the user has opened the letter — a real gesture, so playback is allowed. */
  autoStart: boolean
  /** Hide the button until the story actually needs it. */
  visible: boolean
}

/**
 * Floating glass music button. Never autoplays on load — playback only ever
 * starts from a user gesture (opening the envelope, or tapping this button).
 */
export default function MusicPlayer({ autoStart, visible }: Props) {
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytRef = useRef<YTPlayer | null>(null)
  const ytHostRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  const fileSrc = birthday.music.file
  const ytId = fileSrc ? null : parseYouTubeId(birthday.music.youtube)
  const hasSource = Boolean(fileSrc || ytId)

  /* ── set up the YouTube player once (hidden, muted-free, looping) ── */
  useEffect(() => {
    if (!ytId || !ytHostRef.current) return
    let cancelled = false

    loadYouTubeApi().then(() => {
      if (cancelled || !ytHostRef.current || !window.YT) return
      ytRef.current = new window.YT.Player(ytHostRef.current, {
        videoId: ytId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: ytId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.setVolume(Math.round(birthday.music.volume * 100))
            if (!cancelled) setReady(true)
          },
          onStateChange: (e: { data: number }) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) setPlaying(true)
            if (e.data === 2 || e.data === 0) setPlaying(false)
          },
        },
      })
    })

    return () => {
      cancelled = true
      ytRef.current?.destroy()
      ytRef.current = null
    }
  }, [ytId])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = birthday.music.volume
      setReady(true)
    }
  }, [fileSrc])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const play = useCallback(() => {
    if (fileSrc && audioRef.current) {
      audioRef.current.play().then(
        () => setPlaying(true),
        () => showToast('เบราว์เซอร์บล็อกเสียงไว้ ลองกดอีกครั้งนะ'),
      )
      return
    }
    if (ytRef.current) {
      ytRef.current.playVideo()
      setPlaying(true)
    }
  }, [fileSrc, showToast])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    ytRef.current?.pauseVideo()
    setPlaying(false)
  }, [])

  /* Kick off once, right after the user's opening gesture. */
  useEffect(() => {
    if (!autoStart || startedRef.current || !hasSource || !ready) return
    startedRef.current = true
    play()
  }, [autoStart, hasSource, ready, play])

  const toggle = () => {
    if (!hasSource) {
      showToast('ใส่ลิงก์เพลงได้ที่ src/data/birthday.ts 🎵')
      return
    }
    if (playing) {
      pause()
      showToast('Music Off')
    } else {
      play()
      showToast('Music On')
    }
  }

  return (
    <>
      {/* hidden players */}
      {fileSrc && <audio ref={audioRef} src={withBase(fileSrc)} loop preload="auto" />}
      {ytId && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            width: 1,
            height: 1,
            bottom: 0,
            left: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <div ref={ytHostRef} />
        </div>
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed right-4 top-4 z-[90] flex items-center gap-2 safe-t"
            style={{ paddingTop: 0, top: 'max(1rem, env(safe-area-inset-top))' }}
            initial={{ opacity: 0, y: -18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence>
              {toast && (
                <motion.span
                  className="glass rounded-full px-3.5 py-2 text-[12px] font-medium text-ink shadow-lg"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  {toast}
                </motion.span>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              aria-label={playing ? 'ปิดเพลง' : 'เปิดเพลง'}
              className="glass relative flex h-12 w-12 items-center justify-center rounded-full text-lg shadow-[0_10px_28px_-10px_rgba(120,60,95,.55)]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className={playing && !reduce ? 'animate-float' : ''}>🎵</span>

              {/* equaliser bars while playing */}
              {playing && !reduce && (
                <span className="absolute -bottom-1 flex items-end gap-[2px]">
                  {[0, 1, 2].map((b) => (
                    <motion.span
                      key={b}
                      className="w-[3px] rounded-full bg-blush-deep"
                      animate={{ height: [4, 11, 5, 9, 4] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: b * 0.14,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </span>
              )}

              {playing && !reduce && (
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full border border-blush-deep/50"
                  animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
