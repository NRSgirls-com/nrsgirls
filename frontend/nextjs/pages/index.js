import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>NRSgirls - Where Rhythm Fuels Seduction</title>
        <meta name="description" content="NRSgirls is the premier platform where professional DJs and performers unite through our revolutionary Global Audio Bus technology." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          {/* Hero Section */}
          <section style={styles.hero}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>
                <span style={styles.brandName}>NRSgirls</span>
              </h1>
              <p style={styles.tagline}>Where Rhythm Fuels Seduction</p>
              <p style={styles.heroDescription}>
                The premier platform uniting professional DJs and performers through
                our revolutionary Global Audio Bus technology. Experience synchronized
                live entertainment like never before.
              </p>
              <div style={styles.heroCTA}>
                <Link href="/register" style={styles.primaryButton}>
                  Join the Platform
                </Link>
                <Link href="/pricing" style={styles.secondaryButton}>
                  View Pricing
                </Link>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section style={styles.visionSection}>
            <div style={styles.sectionContainer}>
              <h2 style={styles.sectionTitle}>Our Vision</h2>
              <div style={styles.visionGrid}>
                <div style={styles.visionCard}>
                  <div style={styles.visionIcon}>🎧</div>
                  <h3 style={styles.visionCardTitle}>Global Audio Bus</h3>
                  <p style={styles.visionCardText}>
                    Professional DJs provide synchronized audio experiences that
                    performers can tap into from anywhere in the world.
                  </p>
                </div>
                <div style={styles.visionCard}>
                  <div style={styles.visionIcon}>💃</div>
                  <h3 style={styles.visionCardTitle}>For Performers</h3>
                  <p style={styles.visionCardText}>
                    Perform to curated, high-quality DJ sets instead of generic
                    playlists. Build your audience with premium content.
                  </p>
                </div>
                <div style={styles.visionCard}>
                  <div style={styles.visionIcon}>🎵</div>
                  <h3 style={styles.visionCardTitle}>For DJs</h3>
                  <p style={styles.visionCardText}>
                    Your mixes power performances across the globe. Reach new
                    audiences and earn from your craft.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Registration CTA Section */}
          <section style={styles.ctaSection}>
            <div style={styles.sectionContainer}>
              <h2 style={styles.ctaSectionTitle}>Ready to Join?</h2>
              <p style={styles.ctaText}>
                We&apos;re building something special. Register your interest today
                and be among the first to experience NRSgirls.
              </p>
              <div style={styles.ctaGrid}>
                <Link href="/register?type=performer" style={styles.ctaCard}>
                  <h3 style={styles.ctaCardTitle}>Performers</h3>
                  <p style={styles.ctaCardText}>
                    Register as a performer and gain access to premium DJ sets,
                    privacy controls, and a global audience.
                  </p>
                  <span style={styles.ctaCardLink}>Register Interest →</span>
                </Link>
                <Link href="/register?type=dj" style={styles.ctaCard}>
                  <h3 style={styles.ctaCardTitle}>DJs</h3>
                  <p style={styles.ctaCardText}>
                    Share your mixes on the Global Audio Bus. Power performances
                    worldwide and grow your brand.
                  </p>
                  <span style={styles.ctaCardLink}>Register Interest →</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section style={styles.privacySection}>
            <div style={styles.sectionContainer}>
              <h2 style={styles.sectionTitle}>Privacy First</h2>
              <p style={styles.privacyText}>
                NRSgirls is built with performer privacy as a core principle. We offer
                robust privacy controls, content protection, and compliance with all
                applicable laws. Your safety and security are our top priorities.
              </p>
            </div>
          </section>
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
  },
  hero: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    background: 'linear-gradient(180deg, #0f0f0f 0%, #1a0a10 100%)',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
  },
  heroTitle: {
    marginBottom: '0.5rem',
  },
  brandName: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#ff3366',
    letterSpacing: '-1px',
  },
  tagline: {
    fontSize: '1.5rem',
    color: '#ff6699',
    fontStyle: 'italic',
    marginBottom: '1.5rem',
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: '#cccccc',
    lineHeight: 1.7,
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  heroCTA: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '1rem 2.5rem',
    backgroundColor: '#ff3366',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    border: '2px solid #ffffff',
    transition: 'all 0.2s',
  },
  visionSection: {
    padding: '5rem 1rem',
    backgroundColor: '#0a0a0a',
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#ffffff',
  },
  visionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  visionCard: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #333',
    textAlign: 'center',
  },
  visionIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  visionCardTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: '#ff3366',
  },
  visionCardText: {
    color: '#cccccc',
    lineHeight: 1.6,
  },
  ctaSection: {
    padding: '5rem 1rem',
    backgroundColor: '#0f0f0f',
  },
  ctaSectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  ctaText: {
    fontSize: '1.125rem',
    textAlign: 'center',
    color: '#888888',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
  },
  ctaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaCard: {
    display: 'block',
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #333',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  ctaCardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    color: '#ffffff',
  },
  ctaCardText: {
    color: '#cccccc',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  ctaCardLink: {
    color: '#ff3366',
    fontWeight: 'bold',
  },
  privacySection: {
    padding: '4rem 1rem',
    backgroundColor: '#0a0a0a',
    textAlign: 'center',
  },
  privacyText: {
    fontSize: '1.125rem',
    color: '#888888',
    lineHeight: 1.7,
    maxWidth: '700px',
    margin: '0 auto',
  },
};
