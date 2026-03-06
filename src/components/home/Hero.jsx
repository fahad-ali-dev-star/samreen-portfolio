import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'Samreen Shafqat'
  const textRef = useRef(0)
  const metrics = [
    { value: '30+', label: 'Design Concepts' },
    { value: '20+', label: 'Happy Clients' },
    { value: '1.5 yrs', label: 'Creative Experience' }
  ]

  useEffect(() => {
    const typeWriter = () => {
      if (textRef.current < fullText.length) {
        setDisplayText(fullText.substring(0, textRef.current + 1))
        textRef.current += 1
        setTimeout(typeWriter, 100)
      }
    }
    
    // Start typewriter effect after a short delay
    const timeout = setTimeout(typeWriter, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="hero-kicker">Graphic Designer Portfolio</p>
            <h1>
              Hi, I'm <span id="typewriter-name">{displayText}</span>
              <span className="cursor">|</span>
            </h1>
            <h2 className="hero-subtitle">Visual Identity, UI/UX, and Brand Storytelling</h2>
            <p>
              I design premium digital experiences that combine strategy, aesthetics, and clarity.
              From brand systems to product interfaces, every screen is crafted to feel modern,
              memorable, and conversion-focused.
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn">View My Work</a>
              <a href="#contact" className="btn btn-secondary">Contact Me</a >

             
            </div>
            <div className="hero-metrics">
              {metrics.map((item) => (
                <div key={item.label} className="metric-card">
                  <span className="metric-value">{item.value}</span>
                  <span className="metric-label">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="canvas-card">
              <div className="layer layer-back" />
              <div className="layer layer-mid" />
              <div className="layer layer-front">
                <img 
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Designer workspace with moodboards and digital devices"
                  loading="eager"
                />
              </div>
            </div>
            <div className="preview-chip chip-top">Brand System</div>
            <div className="preview-chip chip-bottom">UI Prototype Ready</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
