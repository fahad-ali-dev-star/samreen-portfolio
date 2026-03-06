import { useState, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto'
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ]

  return (
    <header 
      className={`header ${isScrolled ? 'header-scrolled' : ''}`}
    >
      <div className="container">
        <nav>
          <a href="#home" className="logo">
            Samreen<span>.</span>
          </a>
          
          <ul 
            className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}
            aria-hidden={!isMobileMenuOpen}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMobileMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
