import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const Notification = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`notification notification-${type}`}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification
