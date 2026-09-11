import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  active: boolean
  className?: string
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
  size: number
  /** rockets leave a trail and explode; sparks just fade */
  rocket: boolean
  targetY?: number
}

const PALETTE = [330, 345, 200, 285, 315, 190, 350]

/**
 * Canvas fireworks. One rAF loop, a hard particle cap, and DPR clamped to 2 —
 * this is the part most likely to stutter on a phone, so it stays lean.
 */
export default function Fireworks({ active, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active || reduce) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const small = width < 768
    const MAX_PARTICLES = small ? 260 : 520
    const SHARDS = small ? 34 : 56
    const LAUNCH_MS = small ? 900 : 620

    let particles: Particle[] = []
    let raf = 0
    let lastLaunch = 0
    let running = true

    /* Launch positions favour left / right / centre, as in the brief. */
    const lanes = [0.18, 0.82, 0.5, 0.3, 0.7]
    let lane = 0

    const launch = () => {
      const x = width * (lanes[lane % lanes.length] + (Math.random() - 0.5) * 0.08)
      lane += 1
      const targetY = height * (0.16 + Math.random() * 0.3)
      particles.push({
        x,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(height - targetY) / 62,
        life: 0,
        maxLife: 90,
        hue: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 2.4,
        rocket: true,
        targetY,
      })
    }

    const explode = (p: Particle) => {
      const shards = Math.min(SHARDS, MAX_PARTICLES - particles.length)
      for (let i = 0; i < shards; i++) {
        const angle = (Math.PI * 2 * i) / shards + Math.random() * 0.16
        const speed = 1.4 + Math.random() * 3.4
        particles.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 62 + Math.random() * 42,
          hue: p.hue + (Math.random() - 0.5) * 26,
          size: 1.6 + Math.random() * 1.7,
          rocket: false,
        })
      }
    }

    const tick = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(tick)

      // fade previous frame instead of clearing → free motion trails
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.16)'
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      if (now - lastLaunch > LAUNCH_MS && particles.length < MAX_PARTICLES * 0.7) {
        launch()
        lastLaunch = now
      }

      const next: Particle[] = []
      for (const p of particles) {
        p.life += 1
        p.x += p.vx
        p.y += p.vy

        if (p.rocket) {
          p.vy += 0.12
          if (p.y <= (p.targetY ?? 0) || p.vy >= 0) {
            explode(p)
            continue
          }
        } else {
          p.vy += 0.045
          p.vx *= 0.986
          p.vy *= 0.986
        }

        if (p.life > p.maxLife) continue

        const alpha = p.rocket ? 1 : 1 - p.life / p.maxLife
        ctx.beginPath()
        ctx.fillStyle = `hsla(${p.hue}, 92%, ${p.rocket ? 82 : 68}%, ${alpha})`
        ctx.arc(p.x, p.y, p.size * (p.rocket ? 1 : alpha * 1.15 + 0.3), 0, Math.PI * 2)
        ctx.fill()

        next.push(p)
      }
      particles = next.length > MAX_PARTICLES ? next.slice(-MAX_PARTICLES) : next
    }

    // pause when the tab is hidden so we don't burn battery in the background
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, reduce])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  )
}
