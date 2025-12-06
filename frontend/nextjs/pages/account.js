import Head from 'next/head';
import Link from 'next/link';

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
        <title>Account - NRSgirls</title>
      </Head>
      <div style={styles.main}>
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
          <p style={styles.note}>
            Note: This is a placeholder page. In production, this would fetch
            real subscription data from the API.
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
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
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
  },
  statusContainer: {
    marginBottom: '2rem',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  label: {
    color: '#cccccc',
  },
  value: {
    fontWeight: 'bold',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#0070f3',
    color: '#ffffff',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  note: {
    fontSize: '0.875rem',
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
