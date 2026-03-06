import { motion } from 'framer-motion'

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <motion.div
          className="loader-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p>{text}</p>
      </div>
    )
  }

  return (
    <div className="loader-inline">
      <motion.div
        className="loader-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p>{text}</p>
    </div>
  )
}

export default Loader
