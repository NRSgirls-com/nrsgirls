import Link from 'next/link';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo and Tagline */}
        <Link href="/" style={styles.logoContainer}>
          <span style={styles.logo}>NRSgirls</span>
          <span style={styles.tagline}>Where Rhythm Fuels Seduction</span>
        </Link>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/register" style={styles.navLink}>Join</Link>
          <Link href="/pricing" style={styles.navLink}>Pricing</Link>
          <Link href="/account" style={styles.navLinkButton}>My Account</Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid #222',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#ff3366',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '0.75rem',
    color: '#888888',
    fontStyle: 'italic',
    marginTop: '0.125rem',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  navLinkButton: {
    backgroundColor: '#ff3366',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
};
