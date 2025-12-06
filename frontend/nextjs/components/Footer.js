import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'NRSgirls',
      links: [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/partners', label: 'Partners' },
      ],
    },
    {
      title: 'Product',
      links: [
        { href: '/pricing', label: 'Plans & Pricing' },
        { href: '/help', label: 'Documentation' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Use' },
        { href: '/help', label: 'Help Center' },
      ],
    },
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerContent}>
          {/* Logo and Description */}
          <div style={styles.footerBrand}>
            <Link href="/" style={styles.logo}>
              <span style={styles.logoText}>NRSgirls</span>
            </Link>
            <p style={styles.brandDescription}>
              Premium DJ content and performer platform with privacy-first features.
            </p>
          </div>

          {/* Footer Links */}
          <div style={styles.footerLinks}>
            {footerSections.map((section) => (
              <div key={section.title} style={styles.footerSection}>
                <h3 style={styles.sectionTitle}>{section.title}</h3>
                <ul style={styles.linkList}>
                  {section.links.map((link) => (
                    <li key={link.href + link.label} style={styles.linkItem}>
                      <Link href={link.href} style={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            &copy; {currentYear} NRSgirls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #222',
    padding: '3rem 0 1.5rem',
    marginTop: 'auto',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    gap: '3rem',
    marginBottom: '2rem',
  },
  footerBrand: {
    maxWidth: '300px',
  },
  logo: {
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '1rem',
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
  brandDescription: {
    color: '#888888',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    margin: 0,
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  footerSection: {
    minWidth: '120px',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  linkItem: {
    marginBottom: '0.5rem',
  },
  footerLink: {
    color: '#888888',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    borderTop: '1px solid #222',
    paddingTop: '1.5rem',
    textAlign: 'center',
  },
  copyright: {
    color: '#666666',
    fontSize: '0.85rem',
    margin: 0,
  },
};
