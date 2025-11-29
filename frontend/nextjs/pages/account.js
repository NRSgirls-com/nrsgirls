import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Account() {
  // In a real app, fetch subscription status from API
  const subscriptionStatus = {
    isActive: false,
    plan: 'None',
    nextBillingDate: null,
  };

  return (
    <>
      <Head>
        <title>My Account - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>My Account</h1>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Subscription Status</h2>
              <div style={styles.statusContainer}>
                <div style={styles.statusRow}>
                  <span style={styles.label}>Status:</span>
                  <span
                    style={{
                      ...styles.value,
                      color: subscriptionStatus.isActive ? '#4ade80' : '#ff4444',
                    }}
                  >
                    {subscriptionStatus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={styles.statusRow}>
                  <span style={styles.label}>Plan:</span>
                  <span style={styles.value}>{subscriptionStatus.plan}</span>
                </div>
                {subscriptionStatus.nextBillingDate && (
                  <div style={styles.statusRow}>
                    <span style={styles.label}>Next Billing:</span>
                    <span style={styles.value}>
                      {subscriptionStatus.nextBillingDate}
                    </span>
                  </div>
                )}
              </div>
              {!subscriptionStatus.isActive && (
                <Link href="/pricing" style={styles.button}>
                  Subscribe Now
                </Link>
              )}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Account Settings</h2>
              <p style={styles.comingSoon}>
                Profile settings, privacy controls, and notification preferences
                coming soon.
              </p>
            </div>

            <p style={styles.note}>
              Note: Full account management features will be available after
              authentication is implemented.
            </p>
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
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#ffffff',
  },
  statusContainer: {
    marginBottom: '2rem',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #222',
  },
  label: {
    color: '#888888',
  },
  value: {
    fontWeight: 'bold',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#ff3366',
    color: '#ffffff',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  comingSoon: {
    color: '#888888',
    fontStyle: 'italic',
  },
  note: {
    fontSize: '0.875rem',
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
