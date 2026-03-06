import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState('')

  const contactDetails = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: 'samreenshafqat.ss@gmail.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: 'Pakistan'
    },
    {
      icon: <FaBriefcase />,
      title: 'Freelance',
      value: 'Available for projects'
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target
    const payload = new FormData(form)
    payload.append('access_key', '76806d69-7856-4d45-bb4d-e9b27f04bac6')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload
      })

      const data = await response.json()

      if (data.success) {
        setResult('Success! Your message has been sent.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setResult('Error sending message. Please try again.')
      }
    } catch {
      setResult('Error sending message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Get In Touch</h2>
        </motion.div>

        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Let's Work Together</h3>
            <p>
              I'm always open to discussing new opportunities, creative projects, 
              or potential collaborations. Feel free to reach out if you have a 
              project in mind or just want to say hello!
            </p>

            <div className="contact-details">
              {contactDetails.map((detail, index) => (
                <motion.div 
                  key={index}
                  className="contact-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {detail.icon}
                  <div>
                    <h4>{detail.title}</h4>
                    <p>{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="contact-form"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form id="contactForm" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="subject"
                placeholder="Subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                value={formData.message}
                onChange={handleChange}
                required
              />
              <motion.button 
                type="submit" 
                className="btn"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
              {result && <p>{result}</p>}
            </form>
          </motion.div>
          <a href="https://www.instagram.com/samreenshafqat.ss?utm_source=qr&igsh=MXE3ZWplMm43a2UybQ==" target="_blank" rel="noopener noreferrer" className="btn instagram-btn">Instagram</a>
        </div>
        
      </div>
    </section>
  )
}

export default Contact
