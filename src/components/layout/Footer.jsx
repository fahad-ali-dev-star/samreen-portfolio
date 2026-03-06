import { Link } from 'react-router-dom'
import { FaGithub, FaFacebook, FaLinkedinIn, FaInstagram, FaCog } from 'react-icons/fa'

const Footer = () => {
  const socialLinks = [
    { icon: <FaGithub />, href: '#', label: 'GitHub' },
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' }
  ]

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <a href="#home" className="logo">
            Samreen<span>.</span>
          </a>
          
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="admin-link">
            <Link to="/admin">
              <FaCog /> Admin Panel
            </Link>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Samreen Shafqat. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
