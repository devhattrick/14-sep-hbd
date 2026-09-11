import { motion, useScroll, useTransform } from 'framer-motion'
import AmbientLayer from './AmbientLayer'
import FloatingHearts from './FloatingHearts'

type Props = { onHeartTap: () => void }

/**
 * One continuous backdrop for the whole scrolling middle act. The three
 * gradients cross-fade with scroll position so the story never feels like
 * separate sections stacked on top of each other.
 */
export default function JourneyBackground({ onHeartTap }: Props) {
  const { scrollYProgress } = useScroll()

  const dawn = useTransform(scrollYProgress, [0, 0.28, 0.42], [1, 1, 0])
  const day = useTransform(scrollYProgress, [0.28, 0.45, 0.72, 0.84], [0, 1, 1, 0])
  const dusk = useTransform(scrollYProgress, [0.72, 0.9], [0, 1])
  const nightMood = useTransform(scrollYProgress, [0.72, 0.95], [0, 1])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: dawn,
          background:
            'linear-gradient(170deg, #DFF3FF 0%, #FFF8FC 40%, #FFEAF5 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: day,
          background:
            'linear-gradient(160deg, #FFF8FC 0%, #FFEFF8 45%, #EAF6FF 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: dusk,
          background:
            'linear-gradient(170deg, #FFE7F3 0%, #E6D7FF 45%, #C9C0F5 78%, #A9BEEA 100%)',
        }}
      />

      <AmbientLayer tone="light" />
      <motion.div className="absolute inset-0" style={{ opacity: nightMood }}>
        <AmbientLayer tone="night" />
      </motion.div>

      <div className="pointer-events-auto absolute inset-0">
        <FloatingHearts tone="light" onHeartTap={onHeartTap} density={9} />
      </div>
    </div>
  )
}
