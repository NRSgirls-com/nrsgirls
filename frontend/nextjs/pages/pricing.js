import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_example', // Placeholder price ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // In a real app, redirect to Stripe Checkout
      alert(`Checkout session created: ${data.sessionId}\n\nIn production, this would redirect to Stripe Checkout.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pricing - NRSgirls</title>
      </Head>
      <div style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Pricing</h1>
          <div style={styles.pricingCard}>
            <h2 style={styles.cardTitle}>Premium Membership</h2>
            <p style={styles.price}>$29.99/month</p>
            <ul style={styles.featureList}>
              <li>Access to premium DJ content</li>
              <li>Exclusive live streams</li>
              <li>Ad-free experience</li>
              <li>Support creators directly</li>
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </div>
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
  pricingCard: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '1.75rem',
    marginBottom: '1rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0070f3',
    marginBottom: '1.5rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#0070f3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  error: {
    marginTop: '1rem',
    color: '#ff4444',
    textAlign: 'center',
  },
};
