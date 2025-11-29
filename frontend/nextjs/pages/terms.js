import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>Terms of Service</h1>
            <p style={styles.lastUpdated}>Last Updated: November 2025</p>

            <div style={styles.content}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
                <p style={styles.text}>
                  By accessing or using NRSgirls.com (&quot;the Service&quot;), you agree to be
                  bound by these Terms of Service. If you do not agree to these terms,
                  please do not use the Service.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>2. Age Requirement</h2>
                <p style={styles.text}>
                  You must be at least 18 years of age (or the age of majority in your
                  jurisdiction, whichever is greater) to access this Service. By using
                  NRSgirls, you represent and warrant that you meet this age requirement.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>3. User Accounts</h2>
                <p style={styles.text}>
                  You are responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account. You
                  agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>4. Content Guidelines</h2>
                <p style={styles.text}>
                  Users must comply with all applicable laws when creating, uploading, or
                  sharing content on the platform. Prohibited content includes but is not
                  limited to: illegal content, content involving minors, non-consensual
                  content, and content that violates intellectual property rights.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>5. Payment Terms</h2>
                <p style={styles.text}>
                  Subscription fees are billed in advance on a monthly basis. You authorize
                  us to charge your payment method for all applicable fees. All payments
                  are processed securely through our payment provider (Stripe).
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>6. Intellectual Property</h2>
                <p style={styles.text}>
                  The Service and its original content, features, and functionality are
                  owned by NRSgirls and are protected by international copyright, trademark,
                  and other intellectual property laws.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>7. Limitation of Liability</h2>
                <p style={styles.text}>
                  NRSgirls shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use or inability
                  to use the Service.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>8. Contact</h2>
                <p style={styles.text}>
                  For questions about these Terms of Service, please contact us through
                  our Contact page.
                </p>
              </section>

              <div style={styles.notice}>
                <p>
                  <strong>Note:</strong> This is a placeholder Terms of Service document.
                  The full legal terms should be reviewed by legal counsel before launch.
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
