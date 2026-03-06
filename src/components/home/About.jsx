import { motion } from 'framer-motion'
import { FaFigma, FaPaintBrush, FaPalette, FaFilm, FaRobot } from 'react-icons/fa'

const About = () => {
  const tools = [
    { icon: <FaFigma />, name: 'Figma' },
    { icon: <FaPaintBrush />, name: 'Photoshop' },
    { icon: <FaPalette />, name: 'Illustrator' },
    { icon: <FaFilm />, name: 'After Effects' },
    { icon: <FaRobot />, name: 'ChatGPT' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="about" id="about">
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>About Me</h2>
        </motion.div>

        <div className="about-content">
          <motion.div 
            className="about-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>UI/UX Designer with Passion for Digital Experiences</h3>
            
            <p>
              I'm a UI/UX designer with a passion for creating intuitive, user-centered digital 
              experiences. I specialize in designing clean and functional interfaces that not 
              only look good but also solve real user problems.
            </p>
            
            <p>
              With a background in fine arts and hands-on experience in tools like Figma and 
              Photoshop, I bring both creativity and logic into every project.
            </p>

            <div className="education">
              <h4>Education</h4>
              <p>
                Bachelor's in Graphic Design from <strong>Islamia University Bahawalpur</strong> (2021–2025)
              </p>
            </div>

            <p>
              I've worked for a year at Workfello Studio and another year remotely with{' '}
              <strong>Creative Fox Studio</strong>, gaining hands-on experience in designing 
              user-centered digital products.
            </p>

            <div className="tools">
              <h4>Tools & Technologies</h4>
              <motion.div 
                className="tools-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {tools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    className="tool-item"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {tool.icon}
                    <h5>{tool.name}</h5>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
