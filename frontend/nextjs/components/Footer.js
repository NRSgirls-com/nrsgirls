import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Legal Links */}
        <div style={styles.linksSection}>
          <Link href="/terms" style={styles.link}>Terms of Service</Link>
          <span style={styles.divider}>|</span>
          <Link href="/privacy" style={styles.link}>Privacy Policy</Link>
          <span style={styles.divider}>|</span>
          <Link href="/dmca" style={styles.link}>DMCA</Link>
          <span style={styles.divider}>|</span>
          <Link href="/2257" style={styles.link}>18 U.S.C. 2257</Link>
          <span style={styles.divider}>|</span>
          <Link href="/contact" style={styles.link}>Contact</Link>
        </div>

        {/* Legal Disclaimers */}
        <div style={styles.disclaimers}>
          <p style={styles.disclaimer}>
            <strong>Age Restriction:</strong> This website contains adult content
            and is intended for individuals 18 years of age or older. By accessing
            this site, you confirm that you are at least 18 years old (or the age
            of majority in your jurisdiction, whichever is greater).
          </p>
          <p style={styles.disclaimer}>
            <strong>18 U.S.C. 2257 Compliance:</strong> All models, actors, and other
            persons appearing in any visual depiction of actual sexually explicit conduct
            were eighteen years of age or older at the time of the creation of such
            depictions. Records required pursuant to 18 U.S.C. 2257 are maintained by
            the Custodian of Records.
          </p>
          <p style={styles.disclaimer}>
            <strong>California Residents:</strong> For information about your privacy
            rights under the California Consumer Privacy Act (CCPA), please see our
            Privacy Policy.
          </p>
        </div>

        {/* Copyright */}
        <div style={styles.copyright}>
          <p>&copy; {currentYear} NRSgirls.com. All rights reserved.</p>
          <p style={styles.tagline}>Where Rhythm Fuels Seduction</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #222',
    padding: '2rem 1rem',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  linksSection: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  link: {
    color: '#888888',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
  },
  divider: {
    color: '#444444',
  },
  disclaimers: {
    maxWidth: '800px',
    margin: '0 auto 1.5rem',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#666666',
    fontSize: '0.75rem',
    lineHeight: 1.6,
    marginBottom: '0.75rem',
  },
  copyright: {
    textAlign: 'center',
    color: '#888888',
    fontSize: '0.875rem',
  },
  tagline: {
    color: '#ff3366',
    fontStyle: 'italic',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
  },
};
