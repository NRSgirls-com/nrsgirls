import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>NRSgirls - DJ & Performer Platform</title>
        <meta name="description" content="Premium DJ content platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Welcome to NRSgirls</h1>
          <p style={styles.description}>
            Premium DJ content and performer platform with privacy-first features
          </p>
          <div style={styles.buttonContainer}>
            <Link href="/pricing" style={styles.button}>
              View Pricing
            </Link>
            <Link href="/account" style={styles.buttonSecondary}>
              My Account
            </Link>
            <Link href="/help" style={styles.buttonSecondary}>
              Help Center
            </Link>
            <Link href="/music0flaw" style={styles.buttonSecondary}>
              DJ Rights Initiative
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
  },
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#cccccc',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    padding: '1rem 2rem',
    backgroundColor: '#333333',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};
