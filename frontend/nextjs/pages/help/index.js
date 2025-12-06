import Head from 'next/head';
import Link from 'next/link';

const articles = [
  { slug: 'stream-not-connected', title: 'My stream doesn\'t appear to be connected' },
  { slug: 'go-live', title: 'How do I go live with Mixcloud?', featured: true },
  { slug: 'go-live-obs', title: 'How do I go live with OBS?' },
  { slug: 'faq', title: 'FAQ: Mixcloud Live' },
  { slug: 'troubleshooting', title: 'Troubleshooting your live stream' },
  { slug: 'promote-stream', title: 'How do I promote a stream on Mixcloud Live?' },
  { slug: 'creator-guide', title: 'The Mixcloud Live Creator Guide' },
  { slug: 'unlisting', title: 'Unlisting a live stream' },
  { slug: 'save-archive', title: 'How do I save my Mixcloud Live stream archive?' },
];

export default function HelpCenter() {
  return (
    <>
      <Head>
        <title>Help Center - Mixcloud Live - GRT0FF</title>
        <meta name="description" content="Get help with streaming on Mixcloud Live" />
      </Head>
      <div style={styles.main}>
        <div style={styles.container}>
          <div style={styles.breadcrumb}>
            <Link href="/" style={styles.breadcrumbLink}>NRSgirls</Link>
            <span style={styles.breadcrumbSeparator}>/</span>
            <Link href="/help" style={styles.breadcrumbLink}>Help Center</Link>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Mixcloud Live</span>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>Mixcloud Live</h1>
            <p style={styles.subtitle}>I want to stream to Mixcloud Live</p>
          </div>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search articles..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.articlesSection}>
            <h2 style={styles.sectionTitle}>Articles in this section</h2>
            <div style={styles.articleList}>
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/help/${article.slug}`}
                  style={styles.articleLink}
                >
                  <div style={styles.articleItem}>
                    <svg style={styles.articleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                    <span style={styles.articleTitle}>{article.title}</span>
                    {article.featured && <span style={styles.featuredBadge}>Popular</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 70px)',
    padding: '2rem',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    fontSize: '0.875rem',
  },
  breadcrumbLink: {
    color: '#0070f3',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    color: '#666666',
  },
  breadcrumbCurrent: {
    color: '#999999',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#999999',
  },
  searchContainer: {
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '0.5rem',
    color: '#ffffff',
    outline: 'none',
  },
  articlesSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    color: '#999999',
    marginBottom: '1.5rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  articleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  articleLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  articleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  articleIcon: {
    width: '20px',
    height: '20px',
    color: '#666666',
    flexShrink: 0,
  },
  articleTitle: {
    fontSize: '1rem',
    color: '#ffffff',
    flex: 1,
  },
  featuredBadge: {
    fontSize: '0.75rem',
    backgroundColor: '#0070f3',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
  },
};
