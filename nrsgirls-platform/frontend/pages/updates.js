import Head from 'next/head';
import Link from 'next/link';

const businessUpdates = [
  {
    title: 'Now booking festival slots and brand activations',
    detail:
      'Reach out for summer lineups, pop-ups, and nightlife partnerships.',
  },
  {
    title: 'Fresh Mixcloud drops every month',
    detail: 'New genre blends, guest features, and themed series.',
  },
  {
    title: 'YouTube channel refreshed',
    detail: 'Live set clips, behind-the-scenes edits, and DJ tips.',
  },
];

export default function Updates() {
  return (
    <>
      <Head>
        <title>Updates, Mixes &amp; Videos - NRSgirls</title>
        <meta
          name="description"
          content="Business updates, Mixcloud mixes, and YouTube videos from NRSgirls."
        />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <Link href="/" style={styles.backLink}>
            ← Back to Home
          </Link>
          <header style={styles.header}>
            <h1 style={styles.title}>Updates, Mixes &amp; Videos</h1>
            <p style={styles.subtitle}>
              Your one-stop hub for business updates, new mixes, and visual
              content.
            </p>
          </header>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Updates</h2>
            <div style={styles.cardGrid}>
              {businessUpdates.map((update) => (
                <article key={update.title} style={styles.card}>
                  <h3 style={styles.cardTitle}>{update.title}</h3>
                  <p style={styles.cardCopy}>{update.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Mixcloud Spotlight</h2>
              <a
                href="https://www.mixcloud.com/djnrsgirls/"
                style={styles.externalLink}
                target="_blank"
                rel="noreferrer"
              >
                Visit Mixcloud →
              </a>
            </div>
            <div style={styles.embedWrapper}>
              <iframe
                title="NRSgirls Mixcloud"
                width="100%"
                height="180"
                src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fdjnrsgirls%2F"
                frameBorder="0"
                allow="autoplay"
                style={styles.embed}
              />
            </div>
            <p style={styles.embedCaption}>
              Stream the latest mixes directly from Mixcloud.
            </p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>YouTube Channel</h2>
              <a
                href="https://www.youtube.com/@NRSGroupFresno"
                style={styles.externalLink}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube →
              </a>
            </div>
            <div style={styles.videoCard}>
              <p style={styles.cardCopy}>
                Subscribe for live set highlights, behind-the-scenes edits, and
                show announcements.
              </p>
              <a
                href="https://www.youtube.com/@NRSGroupFresno"
                style={styles.primaryButton}
                target="_blank"
                rel="noreferrer"
              >
                Open YouTube Channel
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
    padding: '3rem 1.5rem',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  backLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.75rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#cfcfcf',
    margin: 0,
  },
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    margin: 0,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #2f2f2f',
  },
  cardTitle: {
    fontSize: '1.125rem',
    marginBottom: '0.5rem',
  },
  cardCopy: {
    color: '#b3b3b3',
    margin: 0,
    lineHeight: 1.6,
  },
  embedWrapper: {
    backgroundColor: '#1f1f1f',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #2f2f2f',
  },
  embed: {
    borderRadius: '0.75rem',
  },
  embedCaption: {
    marginTop: '0.75rem',
    color: '#9ca3af',
  },
  externalLink: {
    color: '#ec4899',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  videoCard: {
    backgroundColor: '#1f1f1f',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #2f2f2f',
  },
  primaryButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.75rem',
    fontWeight: 'bold',
  },
};
