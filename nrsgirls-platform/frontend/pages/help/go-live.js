import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const relatedArticles = [
  { slug: 'go-live-obs', title: 'How do I go live with OBS?' },
  { slug: 'faq', title: 'FAQ: Mixcloud Live' },
  { slug: 'promote-stream', title: 'How do I promote a stream on Mixcloud Live?' },
  { slug: 'unlisting', title: 'Unlisting a live stream' },
  { slug: 'recover-account', title: 'Recover a Mixcloud account that was created with Facebook' },
];

const tableOfContents = [
  { id: 'equipment', title: 'Equipment' },
  { id: 'streaming-software', title: 'Setting up your streaming software' },
  { id: 'connecting', title: 'Connecting to Mixcloud' },
  { id: 'ending', title: 'Ending the stream' },
];

export default function GoLive() {
  const [helpful, setHelpful] = useState(null);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>How do I go live with Mixcloud? - Help Center - GRT0FF</title>
        <meta name="description" content="Learn how to set up and start your first live stream on Mixcloud Live" />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.breadcrumb}>
            <Link href="/" style={styles.breadcrumbLink}>GRT0FF</Link>
            <span style={styles.breadcrumbSeparator}>/</span>
            <Link href="/help" style={styles.breadcrumbLink}>Help Center</Link>
            <span style={styles.breadcrumbSeparator}>/</span>
            <Link href="/help" style={styles.breadcrumbLink}>Mixcloud Live</Link>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Go Live</span>
          </div>

          <div style={styles.layout}>
            <article style={styles.article}>
              <h1 style={styles.title}>How do I go live with Mixcloud?</h1>

              <div style={styles.tocBox}>
                <h3 style={styles.tocTitle}>Jump ahead in this article:</h3>
                <ul style={styles.tocList}>
                  {tableOfContents.map((item) => (
                    <li key={item.id} style={styles.tocItem}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        style={styles.tocLink}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment Section */}
              <section id="equipment" style={styles.section}>
                <h2 style={styles.sectionTitle}>Equipment</h2>
                <p style={styles.paragraph}>
                  Before you start your first Live broadcast on Mixcloud, you&apos;ll need to set up your hardware and software to allow you to stream.
                </p>

                <h3 style={styles.subheading}>You&apos;ll need:</h3>
                <ul style={styles.list}>
                  <li style={styles.listItem}>
                    <strong>A subscription to Mixcloud Pro</strong>
                  </li>
                  <li style={styles.listItem}>
                    <strong>A computer capable of live-streaming</strong>
                  </li>
                  <li style={styles.listItem}>
                    <strong>A steady internet connection</strong>
                    <ul style={styles.nestedList}>
                      <li style={styles.nestedListItem}>We recommend a minimum upload speed of 3mbps</li>
                      <li style={styles.nestedListItem}>Use a wired connection for better stability</li>
                    </ul>
                  </li>
                  <li style={styles.listItem}>
                    <strong>Streaming software compatible with RTMP streaming</strong>
                    <ul style={styles.nestedList}>
                      <li style={styles.nestedListItem}>
                        We recommend <strong>OBS</strong> because it&apos;s free and easy to set up.
                      </li>
                      <li style={styles.nestedListItem}>
                        Check out our blog post with all the information you need to get broadcasting with OBS here:{' '}
                        <Link href="/help/go-live-obs" style={styles.inlineLink}>
                          An Easy Guide To Live Streaming With OBS
                        </Link>
                      </li>
                      <li style={styles.nestedListItem}>
                        Other suggestions for streaming software include Gramophone (audio only), Restream, XSplit, Streamlabs OBS, Wirecast, vMix, and Lightstream.
                      </li>
                    </ul>
                  </li>
                </ul>

                <h3 style={styles.subheading}>Optional:</h3>
                <ul style={styles.list}>
                  <li style={styles.listItem}>A webcam or other visuals</li>
                  <li style={styles.listItem}>
                    <strong>Additional hardware</strong>
                    <ul style={styles.nestedList}>
                      <li style={styles.nestedListItem}>
                        Depending on your setup, you may benefit from including extra gear, such as headphones, microphones, a mixer, or an audio interface or soundcard
                      </li>
                      <li style={styles.nestedListItem}>
                        For advice on different setups based on the content you&apos;re live-streaming, check out the Creator Resources on our blog
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>

              {/* Streaming Software Section */}
              <section id="streaming-software" style={styles.section}>
                <h2 style={styles.sectionTitle}>Setting up your streaming software</h2>
                <p style={styles.paragraph}>
                  The recommended settings for streaming on Mixcloud Live are:
                </p>

                <div style={styles.settingsTable}>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Audio quality:</span>
                    <span style={styles.settingValue}>320k</span>
                  </div>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Video quality:</span>
                    <span style={styles.settingValue}>720p to 1080p</span>
                  </div>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Bitrate:</span>
                    <span style={styles.settingValue}>2500kbps to 3500kbps and CBR, not VBR</span>
                  </div>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Frames Per Second:</span>
                    <span style={styles.settingValue}>30fps</span>
                  </div>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Visual ratio:</span>
                    <span style={styles.settingValue}>16:9</span>
                  </div>
                  <div style={styles.settingRow}>
                    <span style={styles.settingLabel}>Keyframe interval:</span>
                    <span style={styles.settingValue}>2s</span>
                  </div>
                </div>

                <p style={styles.paragraph}>
                  If you&apos;re using OBS, you can find more information in our{' '}
                  <Link href="/help/go-live-obs" style={styles.inlineLink}>set-up guide here</Link>.
                </p>
                <p style={styles.paragraph}>
                  If you&apos;re using other streaming software, we recommend checking out the developer&apos;s resources for set-up advice.
                </p>
              </section>

              {/* Connecting Section */}
              <section id="connecting" style={styles.section}>
                <h2 style={styles.sectionTitle}>Connecting to Mixcloud</h2>
                <p style={styles.paragraph}>
                  After choosing your broadcasting software and configuring your stream, connect the software to Mixcloud Live using the following steps.
                </p>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>1</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Click on Create at the top of Mixcloud and select Go Live</h4>
                    <div style={styles.imageContainer}>
                      <div style={styles.imagePlaceholder}>
                        <span style={styles.imagePlaceholderText}>Screenshot: Create menu with Go Live option</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>2</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Add your stream information</h4>
                    <p style={styles.stepText}>
                      Adding a name, description, and tags for your stream gives your fans insights into your content and helps new viewers decide to join your stream.
                    </p>
                    <div style={styles.imageContainer}>
                      <div style={styles.imagePlaceholder}>
                        <span style={styles.imagePlaceholderText}>Screenshot: Stream information form</span>
                      </div>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoText}>
                        Your stream will be named &quot;[Your username] live!&quot; by default or if you don&apos;t enter a name in this field. You can set up a custom name to personalize your stream.
                      </p>
                      <p style={styles.infoText}>
                        Once you&apos;ve set up your stream information for the first time, it will be stored as the new default for your future streams.
                      </p>
                      <p style={styles.infoTextWarning}>
                        <strong>Please note:</strong> You cannot change the name, description or tags once you&apos;ve gone live. If you&apos;d like to change any of the information after you&apos;ve started streaming, please stop your stream temporarily.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>3</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Choose who can see your stream</h4>
                    <div style={styles.imageContainer}>
                      <div style={styles.imagePlaceholder}>
                        <span style={styles.imagePlaceholderText}>Screenshot: Visibility toggle</span>
                      </div>
                    </div>
                    <p style={styles.stepText}>
                      You can use this toggle to decide if you want your stream to be public or unlisted (private). You can read more about{' '}
                      <Link href="/help/unlisting" style={styles.inlineLink}>unlisted streams here</Link>.
                    </p>
                  </div>
                </div>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>4</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Add the stream key and server URL to your streaming software</h4>
                    <div style={styles.imageContainer}>
                      <div style={styles.imagePlaceholder}>
                        <span style={styles.imagePlaceholderText}>Screenshot: Stream key and server URL</span>
                      </div>
                    </div>
                    <p style={styles.stepText}>
                      Copy-paste this information into the corresponding fields of your streaming software.
                    </p>
                    <div style={styles.infoBox}>
                      <p style={styles.infoText}>
                        Your stream key is re-usable and we recommend you keep this private to avoid others streaming via your Mixcloud profile.
                      </p>
                      <p style={styles.infoText}>
                        If you reset your stream key for security reasons, you may need to update it in your streaming software before you go live again.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>5</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Start streaming via your chosen software</h4>
                    <p style={styles.stepText}>
                      Your stream will connect and you&apos;ll see it on your Mixcloud Live page.
                    </p>
                  </div>
                </div>

                <div style={styles.step}>
                  <div style={styles.stepNumber}>6</div>
                  <div style={styles.stepContent}>
                    <h4 style={styles.stepTitle}>Share your stream</h4>
                    <p style={styles.stepText}>
                      Let your fans know you&apos;re going live so they can tune in! Click the Share Show button and copy the link to your live-stream so you can post it on social media.
                    </p>
                    <div style={styles.tipBox}>
                      <strong>Tip:</strong> The URL of your stream will always be <code style={styles.code}>mixcloud.com/live/[your username]</code>, so it&apos;s easy to remember and share in advance and in your social media bios.
                    </div>
                  </div>
                </div>
              </section>

              {/* Ending Section */}
              <section id="ending" style={styles.section}>
                <h2 style={styles.sectionTitle}>Ending the stream</h2>
                <p style={styles.paragraph}>
                  Simply click the <strong>End Stream</strong> button on your streaming software to stop the connection to Mixcloud Live and take your show off the air.
                </p>
              </section>

              {/* More Resources */}
              <section style={styles.section}>
                <div style={styles.moreResources}>
                  <h3 style={styles.moreResourcesTitle}>For more information about Mixcloud Live, we recommend checking out:</h3>
                  <ul style={styles.resourceList}>
                    <li>
                      <Link href="/help/go-live-obs" style={styles.resourceLink}>
                        An Easy Guide To Live Streaming With OBS
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/faq" style={styles.resourceLink}>
                        FAQ: Mixcloud Live
                      </Link>
                    </li>
                    <li>
                      <Link href="/help/troubleshooting" style={styles.resourceLink}>
                        Troubleshooting your live stream
                      </Link>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Feedback Section */}
              <div style={styles.feedback}>
                <p style={styles.feedbackQuestion}>Was this article helpful?</p>
                <div style={styles.feedbackButtons}>
                  <button
                    onClick={() => setHelpful(true)}
                    style={{
                      ...styles.feedbackButton,
                      backgroundColor: helpful === true ? '#22c55e' : '#333333',
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setHelpful(false)}
                    style={{
                      ...styles.feedbackButton,
                      backgroundColor: helpful === false ? '#ef4444' : '#333333',
                    }}
                  >
                    No
                  </button>
                </div>
                {helpful !== null && (
                  <p style={styles.feedbackThanks}>
                    {helpful ? 'Great! Thanks for your feedback.' : 'We\'re sorry to hear that. Please contact support for more help.'}
                  </p>
                )}
                <p style={styles.helpfulCount}>4368 out of 4897 found this helpful</p>
                <Link href="/contact" style={styles.submitRequest}>
                  Have more questions? Submit a request
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside style={styles.sidebar}>
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>Related articles</h3>
                <ul style={styles.relatedList}>
                  {relatedArticles.map((article) => (
                    <li key={article.slug} style={styles.relatedItem}>
                      <Link href={`/help/${article.slug}`} style={styles.relatedLink}>
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
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
    padding: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    fontSize: '0.875rem',
    flexWrap: 'wrap',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '3rem',
  },
  article: {
    backgroundColor: '#1a1a1a',
    borderRadius: '1rem',
    padding: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
  },
  tocBox: {
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  tocTitle: {
    fontSize: '1rem',
    color: '#999999',
    marginBottom: '1rem',
  },
  tocList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  tocItem: {
    marginBottom: '0.5rem',
  },
  tocLink: {
    background: 'none',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
    textAlign: 'left',
  },
  section: {
    marginBottom: '2.5rem',
    paddingTop: '1rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  paragraph: {
    color: '#cccccc',
    lineHeight: '1.7',
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.125rem',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
    color: '#ffffff',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    color: '#cccccc',
    marginBottom: '0.75rem',
    paddingLeft: '1.5rem',
    position: 'relative',
    lineHeight: '1.6',
  },
  nestedList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '0.5rem',
    marginLeft: '0.5rem',
  },
  nestedListItem: {
    color: '#999999',
    marginBottom: '0.5rem',
    paddingLeft: '1rem',
    position: 'relative',
    lineHeight: '1.5',
    fontSize: '0.95rem',
  },
  inlineLink: {
    color: '#0070f3',
    textDecoration: 'none',
  },
  settingsTable: {
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #333333',
  },
  settingLabel: {
    color: '#999999',
  },
  settingValue: {
    color: '#ffffff',
    fontWeight: '500',
  },
  step: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#0070f3',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.125rem',
    marginBottom: '0.75rem',
    color: '#ffffff',
  },
  stepText: {
    color: '#cccccc',
    lineHeight: '1.6',
    marginBottom: '0.75rem',
  },
  imageContainer: {
    marginBottom: '1rem',
  },
  imagePlaceholder: {
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    padding: '3rem 2rem',
    textAlign: 'center',
    border: '1px dashed #444444',
  },
  imagePlaceholderText: {
    color: '#666666',
    fontSize: '0.875rem',
  },
  infoBox: {
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    padding: '1rem 1.25rem',
    marginTop: '1rem',
  },
  infoText: {
    color: '#999999',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '0.5rem',
  },
  infoTextWarning: {
    color: '#fbbf24',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '0',
  },
  tipBox: {
    backgroundColor: '#1e3a5f',
    borderLeft: '4px solid #0070f3',
    borderRadius: '0 0.5rem 0.5rem 0',
    padding: '1rem 1.25rem',
    marginTop: '1rem',
    color: '#cccccc',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  code: {
    backgroundColor: '#333333',
    padding: '0.2rem 0.4rem',
    borderRadius: '0.25rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  moreResources: {
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    padding: '1.5rem',
  },
  moreResourcesTitle: {
    fontSize: '1rem',
    color: '#cccccc',
    marginBottom: '1rem',
    fontWeight: 'normal',
  },
  resourceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  resourceLink: {
    color: '#0070f3',
    textDecoration: 'none',
    display: 'block',
    padding: '0.5rem 0',
  },
  feedback: {
    borderTop: '1px solid #333333',
    paddingTop: '2rem',
    textAlign: 'center',
  },
  feedbackQuestion: {
    marginBottom: '1rem',
    color: '#cccccc',
  },
  feedbackButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  feedbackButton: {
    padding: '0.5rem 2rem',
    border: 'none',
    borderRadius: '0.25rem',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  feedbackThanks: {
    color: '#999999',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  helpfulCount: {
    color: '#666666',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  submitRequest: {
    color: '#0070f3',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  sidebar: {
    position: 'sticky',
    top: '2rem',
    height: 'fit-content',
  },
  sidebarSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  sidebarTitle: {
    fontSize: '0.875rem',
    color: '#999999',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 'normal',
  },
  relatedList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  relatedItem: {
    marginBottom: '0.75rem',
  },
  relatedLink: {
    color: '#0070f3',
    textDecoration: 'none',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    display: 'block',
  },
};
