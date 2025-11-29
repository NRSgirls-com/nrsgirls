import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Compliance2257() {
  return (
    <>
      <Head>
        <title>18 U.S.C. 2257 Compliance - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>18 U.S.C. 2257 Compliance</h1>
            <p style={styles.lastUpdated}>Record-Keeping Requirements Compliance Statement</p>

            <div style={styles.content}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Compliance Statement</h2>
                <p style={styles.text}>
                  All visual depictions displayed on NRSgirls.com were produced in compliance
                  with the record-keeping requirements of 18 U.S.C. Section 2257 and its
                  associated regulations, or are exempt from such requirements.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Age Verification</h2>
                <p style={styles.text}>
                  All models, actors, actresses, and other persons who appear in any visual
                  depiction of actual sexually explicit conduct appearing or otherwise
                  contained in or at this website were over the age of eighteen (18) years
                  at the time of the creation of such depictions.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Record Custodian</h2>
                <p style={styles.text}>
                  Records required to be maintained pursuant to 18 U.S.C. Section 2257 are
                  kept by the Custodian of Records at the following location:
                </p>
                <div style={styles.contactInfo}>
                  <p>Custodian of Records</p>
                  <p>NRSgirls.com</p>
                  <p>[Address to be provided]</p>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>User-Generated Content</h2>
                <p style={styles.text}>
                  For user-generated content, the original producer of the content is
                  responsible for maintaining compliance with 18 U.S.C. Section 2257
                  record-keeping requirements. All content creators on this platform must
                  verify and maintain records proving all depicted individuals are of
                  legal age.
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Exempt Content</h2>
                <p style={styles.text}>
                  Content that does not contain visual depictions of actual sexually explicit
                  conduct, as defined in 18 U.S.C. Section 2256, is exempt from the
                  record-keeping requirements of 18 U.S.C. Section 2257.
                </p>
              </section>

              <div style={styles.notice}>
                <p>
                  <strong>Note:</strong> This is a placeholder compliance statement.
                  Full 2257 compliance documentation and designated Custodian of Records
                  should be established with legal counsel before allowing any applicable
                  content on the platform.
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
