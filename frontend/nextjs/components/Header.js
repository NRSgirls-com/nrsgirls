import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/account', label: 'My Account' },
    { href: '/help', label: 'Help Center' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoText}>NRSgirls</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...styles.navLink,
                ...(isActive(link.href) ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          style={styles.menuButton}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLineTop : {}),
          }} />
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLineMiddle : {}),
          }} />
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLineBottom : {}),
          }} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav style={{
        ...styles.mobileNav,
        ...(isMenuOpen ? styles.mobileNavOpen : {}),
      }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              ...styles.mobileNavLink,
              ...(isActive(link.href) ? styles.mobileNavLinkActive : {}),
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #222',
    zIndex: 1000,
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0070f3, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  desktopNav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.5rem 0',
    transition: 'color 0.2s ease',
    borderBottom: '2px solid transparent',
  },
  navLinkActive: {
    color: '#ffffff',
    borderBottomColor: '#0070f3',
  },
  menuButton: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    padding: '0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    gap: '5px',
  },
  hamburgerLine: {
    display: 'block',
    width: '24px',
    height: '2px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
  },
  hamburgerLineTop: {
    transform: 'rotate(45deg) translate(5px, 5px)',
  },
  hamburgerLineMiddle: {
    opacity: 0,
  },
  hamburgerLineBottom: {
    transform: 'rotate(-45deg) translate(5px, -5px)',
  },
  mobileNav: {
    display: 'none',
    flexDirection: 'column',
    backgroundColor: 'rgba(15, 15, 15, 0.98)',
    padding: '0',
    maxHeight: '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, padding 0.3s ease',
  },
  mobileNavOpen: {
    maxHeight: '400px',
    padding: '1rem 0',
  },
  mobileNavLink: {
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    padding: '1rem 1.5rem',
    display: 'block',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    borderLeft: '3px solid transparent',
  },
  mobileNavLinkActive: {
    color: '#ffffff',
    backgroundColor: 'rgba(0, 112, 243, 0.1)',
    borderLeftColor: '#0070f3',
  },
};
