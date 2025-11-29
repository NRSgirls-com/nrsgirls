import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

      // In production, redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Checkout session created: ${data.sessionId}\n\nIn production, this would redirect to Stripe Checkout.`);
      }
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
        <meta name="description" content="NRSgirls membership pricing - Premium access to DJ content and performer platform" />
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>Membership Pricing</h1>
            <p style={styles.subtitle}>
              Choose the plan that works for you
            </p>

            <div style={styles.pricingGrid}>
              {/* Free Tier */}
              <div style={styles.pricingCard}>
                <h2 style={styles.cardTitle}>Free</h2>
                <p style={styles.price}>$0</p>
                <p style={styles.priceSubtext}>Forever free</p>
                <ul style={styles.featureList}>
                  <li style={styles.feature}>✓ Browse public content</li>
                  <li style={styles.feature}>✓ Limited DJ previews</li>
                  <li style={styles.feature}>✓ Basic profile</li>
                  <li style={styles.featureDisabled}>✗ Premium streams</li>
                  <li style={styles.featureDisabled}>✗ Ad-free experience</li>
                </ul>
                <button style={styles.buttonSecondary}>
                  Get Started
                </button>
              </div>

              {/* Premium Tier */}
              <div style={{ ...styles.pricingCard, ...styles.pricingCardFeatured }}>
                <div style={styles.featuredBadge}>Most Popular</div>
                <h2 style={styles.cardTitle}>Premium</h2>
                <p style={styles.price}>$29.99</p>
                <p style={styles.priceSubtext}>per month</p>
                <ul style={styles.featureList}>
                  <li style={styles.feature}>✓ Full DJ library access</li>
                  <li style={styles.feature}>✓ Premium performer streams</li>
                  <li style={styles.feature}>✓ Ad-free experience</li>
                  <li style={styles.feature}>✓ Global Audio Bus access</li>
                  <li style={styles.feature}>✓ Support creators directly</li>
                </ul>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    ...styles.buttonPrimary,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
                {error && <p style={styles.error}>{error}</p>}
              </div>
            </div>

            {/* Creator section */}
            <div style={styles.creatorSection}>
              <h2 style={styles.creatorTitle}>For Creators</h2>
              <p style={styles.creatorText}>
                Performers and DJs earn through tips, subscriptions, and platform revenue sharing.
                Join NRSgirls and start earning from your content.
              </p>
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
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#888888',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  pricingCard: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
    position: 'relative',
  },
  pricingCardFeatured: {
    borderColor: '#ff3366',
    boxShadow: '0 0 30px rgba(255, 51, 102, 0.2)',
  },
  featuredBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ff3366',
    color: '#ffffff',
    padding: '0.25rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  price: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#ff3366',
    textAlign: 'center',
    marginBottom: '0.25rem',
  },
  priceSubtext: {
    fontSize: '0.875rem',
    color: '#888888',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  feature: {
    padding: '0.5rem 0',
    color: '#cccccc',
    borderBottom: '1px solid #222',
  },
  featureDisabled: {
    padding: '0.5rem 0',
    color: '#555555',
    borderBottom: '1px solid #222',
  },
  buttonPrimary: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#ff3366',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#333333',
    color: '#ffffff',
    border: '1px solid #555',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    color: '#ff4444',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  creatorSection: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
    textAlign: 'center',
  },
  creatorTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#ff3366',
  },
  creatorText: {
    color: '#cccccc',
    lineHeight: 1.6,
  },
};
