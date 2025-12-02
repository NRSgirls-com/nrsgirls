import Head from 'next/head';
import Link from 'next/link';

const mixcloudProfile = {
  username: 'NRSgirls',
  displayName: 'NRSgirls',
  location: 'Global',
  followers: '12.4K',
  plays: '480K',
  shows: 132,
  tagline: 'Curating bass-heavy mixes and hosting guest DJ takeovers every week.',
  bio: 'Bringing underground club energy to the NRSgirls community with live sets, exclusive mashups, and collaborative streams with our favorite performers.',
  profileUrl: 'https://www.mixcloud.com/nrsgirls/',
};

const featuredMixes = [
  {
    title: 'Sunset Lounge Vol. 07',
    duration: '1h 12m',
    tags: ['House', 'Melodic', 'Live'],
    listens: '42.3K',
    description: 'Warm progressive grooves recorded live from the Ibiza takeover.',
    url: 'https://www.mixcloud.com/nrsgirls/sunset-lounge-vol-07/',
  },
  {
    title: 'Night Shift: Bass Therapy',
    duration: '58m',
    tags: ['Bass', 'Breaks'],
    listens: '36.8K',
    description: 'High-energy breaks with guest drops from resident performers.',
    url: 'https://www.mixcloud.com/nrsgirls/night-shift-bass-therapy/',
  },
  {
    title: 'Afterhours w/ Friends',
    duration: '1h 04m',
    tags: ['Techno', 'Collab'],
    listens: '29.1K',
    description: 'A rotating B2B session featuring the NRSgirls crew.',
    url: 'https://www.mixcloud.com/nrsgirls/afterhours-with-friends/',
  },
];

const schedule = [
  {
    day: 'Thursdays',
    time: '9:00 PM UTC',
    title: 'Guest DJ Showcase',
    detail: 'Weekly live stream with chat, polls, and fan requests.',
  },
  {
    day: 'Saturdays',
    time: '11:00 PM UTC',
    title: 'Club Bus Exclusive',
    detail: 'Premium-only set synced with the global DJ audio bus.',
  },
];

export default function MixcloudProfile() {
  return (
    <>
      <Head>
        <title>{mixcloudProfile.displayName} on Mixcloud</title>
        <meta
          name="description"
          content="Discover the NRSgirls Mixcloud profile, featured mixes, and live show schedule."
        />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <Link href="/" style={styles.backLink}>
            ← Back to Home
          </Link>

          <section style={styles.hero}>
            <div style={styles.avatar}>NG</div>
            <div style={styles.heroContent}>
              <p style={styles.label}>Mixcloud Profile</p>
              <h1 style={styles.title}>{mixcloudProfile.displayName}</h1>
              <p style={styles.subtitle}>{mixcloudProfile.tagline}</p>
              <p style={styles.meta}>
                <span>{mixcloudProfile.location}</span> • <span>{mixcloudProfile.shows} shows</span>
              </p>
              <div style={styles.statsRow}>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Followers</p>
                  <p style={styles.statValue}>{mixcloudProfile.followers}</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Total Plays</p>
                  <p style={styles.statValue}>{mixcloudProfile.plays}</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Shows</p>
                  <p style={styles.statValue}>{mixcloudProfile.shows}</p>
                </div>
              </div>
              <div style={styles.actions}>
                <a
                  href={mixcloudProfile.profileUrl}
                  style={styles.primaryButton}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on Mixcloud
                </a>
                <a href="#schedule" style={styles.secondaryButton}>
                  View Schedule
                </a>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Featured Mixes</h2>
              <p style={styles.sectionSubtitle}>New uploads land here first with tracklists and comments enabled.</p>
            </div>
            <div style={styles.cardGrid}>
              {featuredMixes.map((mix) => (
                <a key={mix.title} href={mix.url} style={styles.mixCard} target="_blank" rel="noreferrer">
                  <div>
                    <div style={styles.mixHeader}>
                      <p style={styles.mixDuration}>{mix.duration}</p>
                      <div style={styles.tagRow}>
                        {mix.tags.map((tag) => (
                          <span key={tag} style={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 style={styles.mixTitle}>{mix.title}</h3>
                    <p style={styles.mixDescription}>{mix.description}</p>
                  </div>
                  <div style={styles.mixFooter}>
                    <p style={styles.mixMeta}>{mix.listens} listens</p>
                    <span style={styles.mixLink}>Listen on Mixcloud →</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section id="schedule" style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Livestream Schedule</h2>
              <p style={styles.sectionSubtitle}>
                Tune in for live club sessions, Q&A breaks, and community premieres.
              </p>
            </div>
            <div style={styles.scheduleGrid}>
              {schedule.map((slot) => (
                <div key={slot.title} style={styles.scheduleCard}>
                  <div style={styles.scheduleHeader}>
                    <p style={styles.scheduleDay}>{slot.day}</p>
                    <p style={styles.scheduleTime}>{slot.time}</p>
                  </div>
                  <h3 style={styles.scheduleTitle}>{slot.title}</h3>
                  <p style={styles.scheduleDetail}>{slot.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...styles.section, ...styles.bioSection }}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>About the Profile</h2>
              <p style={styles.sectionSubtitle}>What to expect on Mixcloud.</p>
            </div>
            <div style={styles.bioContent}>
              <p style={styles.bioText}>{mixcloudProfile.bio}</p>
              <ul style={styles.list}>
                <li>Tracklists published for every mix with timestamped highlights.</li>
                <li>Guest DJ takeovers with performer shout-outs and collabs.</li>
                <li>Chat-friendly livestreams with polls and fan-submitted requests.</li>
                <li>Premium supporters unlock stems, downloads, and club bus exclusives.</li>
              </ul>
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
    backgroundColor: '#0d0d0f',
    color: '#f3f4f6',
    padding: '2rem 1.5rem 4rem',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  backLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '1.5rem',
  },
  hero: {
    background: 'linear-gradient(135deg, #1f2937, #111827)',
    borderRadius: '1.5rem',
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '1.5rem',
    alignItems: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.5rem',
    color: '#0b1220',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  title: {
    fontSize: '2.8rem',
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    margin: 0,
    color: '#e5e7eb',
    fontSize: '1.05rem',
  },
  meta: {
    margin: 0,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '0.9rem',
    padding: '0.85rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statLabel: {
    margin: 0,
    color: '#9ca3af',
    fontSize: '0.9rem',
  },
  statValue: {
    margin: '0.25rem 0 0',
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  primaryButton: {
    padding: '0.85rem 1.4rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '0.75rem',
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.35)',
  },
  secondaryButton: {
    padding: '0.85rem 1.2rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#e5e7eb',
    borderRadius: '0.75rem',
    textDecoration: 'none',
    fontWeight: '700',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  section: {
    marginTop: '2rem',
    backgroundColor: '#111827',
    borderRadius: '1.25rem',
    padding: '1.75rem',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.35)',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.7rem',
  },
  sectionSubtitle: {
    margin: 0,
    color: '#9ca3af',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  mixCard: {
    background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
    borderRadius: '1rem',
    padding: '1.2rem',
    border: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    minHeight: '200px',
    color: 'inherit',
    textDecoration: 'none',
  },
  mixHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mixDuration: {
    margin: 0,
    color: '#9ca3af',
    fontWeight: '700',
  },
  tagRow: {
    display: 'flex',
    gap: '0.35rem',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '0.25rem 0.55rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    color: '#e5e7eb',
  },
  mixTitle: {
    margin: '0.2rem 0 0',
    fontSize: '1.15rem',
  },
  mixDescription: {
    margin: 0,
    color: '#e5e7eb',
    lineHeight: 1.5,
  },
  mixMeta: {
    margin: 0,
    color: '#9ca3af',
    fontWeight: '600',
  },
  mixFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.2rem',
  },
  mixLink: {
    color: '#bfdbfe',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  scheduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
  },
  scheduleCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '1rem',
    padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  scheduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.3rem',
  },
  scheduleDay: {
    margin: 0,
    color: '#e5e7eb',
    fontWeight: '700',
  },
  scheduleTime: {
    margin: 0,
    color: '#9ca3af',
    fontWeight: '700',
  },
  scheduleTitle: {
    margin: '0.35rem 0',
    fontSize: '1.1rem',
  },
  scheduleDetail: {
    margin: 0,
    color: '#d1d5db',
  },
  bioSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
  },
  bioContent: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '1rem',
  },
  bioText: {
    margin: 0,
    color: '#e5e7eb',
    lineHeight: 1.6,
  },
  list: {
    margin: 0,
    paddingLeft: '1rem',
    color: '#d1d5db',
    display: 'grid',
    gap: '0.4rem',
  },
};
