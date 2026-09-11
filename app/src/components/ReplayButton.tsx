import { motion } from 'framer-motion'
import { birthday } from '../data/birthday'

type Props = {
  onReplay: () => void
  delay?: number
}

/** Resets the whole experience back to the sealed envelope. */
export default function ReplayButton({ onReplay, delay = 0 }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onReplay}
      className="btn-ghost"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,.22)' }}
      whileTap={{ scale: 0.96 }}
    >
      {birthday.finale.replay}
    </motion.button>
  )
}
