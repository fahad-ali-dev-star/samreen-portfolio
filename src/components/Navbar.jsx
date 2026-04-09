import React, { useEffect, useState } from 'react';

export function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 820) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = target => {
    setMenuOpen(false);
    onNavigate(target);
  };

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <button className="brand" onClick={() => handleNavigate('home')}>
          S<span>.</span>
        </button>
        <button
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(previous => !previous)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="primary-navigation">
          <button onClick={() => handleNavigate('home')}>Home</button>
          <button onClick={() => handleNavigate('about')}>About</button>
          <button onClick={() => handleNavigate('projects')}>Projects</button>
          <button onClick={() => handleNavigate('contact')}>Contact</button>
          <button className="nav-pill" onClick={() => handleNavigate('admin')}>
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
}
