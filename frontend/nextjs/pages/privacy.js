import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.lastUpdated}>Last Updated: November 2025</p>

            <div style={styles.content}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
                <p style={styles.text}>
                  We collect information you provide directly, including: email address,
                  account credentials, profile information, and payment details. We also
                  collect usage data such as IP addresses, browser type, and device
                  information.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
                <p style={styles.text}>
                  We use your information to: provide and maintain the Service, process
                  payments, communicate with you about your account, improve our services,
                  and comply with legal obligations.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>3. Information Sharing</h2>
                <p style={styles.text}>
                  We do not sell your personal information. We may share information with
                  service providers who assist in operating our platform, when required by
                  law, or with your consent.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>4. Data Security</h2>
                <p style={styles.text}>
                  We implement appropriate technical and organizational measures to protect
                  your personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>5. Your Rights</h2>
                <p style={styles.text}>
                  You have the right to: access your personal data, request correction or
                  deletion, opt out of marketing communications, and request a copy of your
                  data in a portable format.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>6. California Privacy Rights (CCPA)</h2>
                <p style={styles.text}>
                  California residents have additional rights under the CCPA, including:
                  the right to know what personal information is collected, the right to
                  delete personal information, the right to opt-out of the sale of personal
                  information, and the right to non-discrimination for exercising these rights.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>7. Cookies</h2>
                <p style={styles.text}>
                  We use cookies and similar technologies to maintain your session, remember
                  your preferences, and analyze site usage. You can control cookies through
                  your browser settings.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>8. Contact Us</h2>
                <p style={styles.text}>
                  For privacy-related questions or to exercise your rights, please contact
                  us through our Contact page.
                </p>
              </section>

              <div style={styles.notice}>
                <p>
                  <strong>Note:</strong> This is a placeholder Privacy Policy document.
                  The full legal policy should be reviewed by legal counsel before launch.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
  },
  main: {
    flex: 1,
    padding: '3rem 1rem',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  lastUpdated: {
    color: '#888888',
    marginBottom: '2rem',
  },
  content: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: '#ff3366',
  },
  text: {
    color: '#cccccc',
    lineHeight: 1.7,
  },
  notice: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '0.5rem',
    borderLeft: '4px solid #ff3366',
    color: '#888888',
    fontSize: '0.875rem',
  },
};
