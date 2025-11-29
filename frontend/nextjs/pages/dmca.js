import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DMCA() {
  return (
    <>
      <Head>
        <title>DMCA Policy - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>DMCA Policy</h1>
            <p style={styles.lastUpdated}>Digital Millennium Copyright Act Notice</p>

            <div style={styles.content}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Copyright Infringement Notification</h2>
                <p style={styles.text}>
                  NRSgirls respects the intellectual property rights of others and expects
                  users of the Service to do the same. We will respond to notices of alleged
                  copyright infringement that comply with applicable law and are properly
                  provided to us.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Filing a DMCA Notice</h2>
                <p style={styles.text}>
                  If you believe that your copyrighted work has been copied in a way that
                  constitutes copyright infringement, please provide us with the following
                  information:
                </p>
                <ul style={styles.list}>
                  <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                  <li>Identification of the copyrighted work claimed to be infringed</li>
                  <li>Identification of the material that is claimed to be infringing, including its location on our Service</li>
                  <li>Your contact information (address, telephone number, email)</li>
                  <li>A statement that you have a good faith belief that the use is not authorized</li>
                  <li>A statement, under penalty of perjury, that the information in the notification is accurate</li>
                </ul>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Designated Agent</h2>
                <p style={styles.text}>
                  Our designated agent for receiving DMCA notices can be contacted at:
                </p>
                <div style={styles.contactInfo}>
                  <p>DMCA Agent</p>
                  <p>NRSgirls.com</p>
                  <p>Email: dmca@nrsgirls.com</p>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Counter-Notification</h2>
                <p style={styles.text}>
                  If you believe that your content was removed or disabled as a result of
                  mistake or misidentification, you may file a counter-notification with
                  our designated agent containing the required information under the DMCA.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Repeat Infringers</h2>
                <p style={styles.text}>
                  In accordance with the DMCA and other applicable law, NRSgirls has adopted
                  a policy of terminating, in appropriate circumstances, users who are deemed
                  to be repeat infringers.
                </p>
              </section>

              <div style={styles.notice}>
                <p>
                  <strong>Note:</strong> This is a placeholder DMCA policy. The full legal
                  policy and registered DMCA agent should be established before launch.
                </p>
              </div>
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  lastUpdated: {
    color: '#888888',
    marginBottom: '2rem',
  },
  content: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: '#ff3366',
  },
  text: {
    color: '#cccccc',
    lineHeight: 1.7,
  },
  list: {
    color: '#cccccc',
    lineHeight: 1.7,
    marginTop: '1rem',
    paddingLeft: '1.5rem',
  },
  contactInfo: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#0f0f0f',
    borderRadius: '0.5rem',
    color: '#cccccc',
  },
  notice: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '0.5rem',
    borderLeft: '4px solid #ff3366',
    color: '#888888',
    fontSize: '0.875rem',
  },
};
