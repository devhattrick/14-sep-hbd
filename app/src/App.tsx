import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { birthday } from './data/birthday'
import { useAppHeight, useScrollLock } from './lib/hooks'

import EnvelopeIntro from './components/EnvelopeIntro'
import Countdown from './components/Countdown'
import JourneyBackground from './components/JourneyBackground'
import PhotoReveal from './components/PhotoReveal'
import TransitionMessage from './components/TransitionMessage'
import Timeline from './components/Timeline'
import MemoryGallery from './components/MemoryGallery'
import LoveLetter from './components/LoveLetter'
import BirthdayCake from './components/BirthdayCake'
import FinalMessage from './components/FinalMessage'
import MusicPlayer from './components/MusicPlayer'
import Confetti from './components/Confetti'
import EasterEgg from './components/EasterEgg'

/** envelope → countdown → journey (one long scroll) → finale */
type Stage = 'envelope' | 'countdown' | 'journey' | 'finale'

export default function App() {
  useAppHeight()

  const [stage, setStage] = useState<Stage>('envelope')
  const [musicArmed, setMusicArmed] = useState(false)
  /** Bumping this remounts the whole experience — the reset for Replay. */
  const [runId, setRunId] = useState(0)

  const [eggTaps, setEggTaps] = useState(0)
  const [eggOpen, setEggOpen] = useState(false)
  const [eggBurst, setEggBurst] = useState(0)
  const eggFound = useRef(false)

  useScrollLock(stage !== 'journey')

  /* Each stage starts from the top of the page. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [stage, runId])

  const handleOpened = useCallback(() => {
    // Opening the envelope is the user gesture that unlocks audio.
    setMusicArmed(true)
    setStage('countdown')
  }, [])

  const handleHeartTap = useCallback(() => {
    if (eggFound.current) return
    setEggTaps((n) => {
      const next = n + 1
      if (next >= birthday.easterEgg.tapsRequired) {
        eggFound.current = true
        setEggOpen(true)
        setEggBurst((b) => b + 1)
        return 0
      }
      return next
    })
  }, [])

  const handleReplay = useCallback(() => {
    setStage('envelope')
    setMusicArmed(false)
    setEggTaps(0)
    setEggOpen(false)
    eggFound.current = false
    setRunId((n) => n + 1)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <main key={runId} className="relative w-full">
      {/* Persistent chrome: music button, easter-egg confetti, easter-egg modal */}
      <MusicPlayer autoStart={musicArmed} visible={stage !== 'envelope'} />
      <Confetti active={false} burstKey={eggBurst} burstOrigin={{ x: 0.5, y: 0.45 }} />
      <EasterEgg open={eggOpen} onClose={() => setEggOpen(false)} />

      {/* Subtle nudge once they're partway to the secret */}
      <AnimatePresence>
        {eggTaps > 0 && eggTaps < birthday.easterEgg.tapsRequired && (
          <motion.div
            key={eggTaps}
            className="pointer-events-none fixed bottom-5 left-1/2 z-[95] -translate-x-1/2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <span className="glass rounded-full px-4 py-2 text-sm tracking-[0.3em] text-blush-deep">
              {'💗'.repeat(eggTaps)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === 'envelope' && (
          <EnvelopeIntro
            key="envelope"
            onOpened={handleOpened}
            onHeartTap={handleHeartTap}
          />
        )}

        {stage === 'countdown' && (
          <Countdown key="countdown" onDone={() => setStage('journey')} />
        )}

        {stage === 'journey' && (
          <motion.div
            key="journey"
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <JourneyBackground onHeartTap={handleHeartTap} />

            <div className="relative z-10">
              <PhotoReveal />
              <TransitionMessage />
              <Timeline />
              <MemoryGallery />
              <LoveLetter />
              <BirthdayCake onDone={() => setStage('finale')} />
            </div>
          </motion.div>
        )}

        {stage === 'finale' && (
          <FinalMessage
            key="finale"
            onReplay={handleReplay}
            onHeartTap={handleHeartTap}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
