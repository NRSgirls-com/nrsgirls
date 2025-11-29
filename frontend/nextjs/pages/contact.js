import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to an API endpoint
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Message Sent - NRSgirls</title>
        </Head>
        <div style={styles.pageWrapper}>
          <Header />
          <main style={styles.main}>
            <div style={styles.container}>
              <div style={styles.successContainer}>
                <div style={styles.successIcon}>✓</div>
                <h1 style={styles.title}>Message Sent</h1>
                <p style={styles.successText}>
                  Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Us - NRSgirls</title>
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.subtitle}>
              Have questions? We&apos;d love to hear from you.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Your name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="your@email.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="performer">Performer Application</option>
                  <option value="dj">DJ Application</option>
                  <option value="legal">Legal/Compliance</option>
                  <option value="dmca">DMCA Notice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={styles.textarea}
                  placeholder="How can we help you?"
                  rows={6}
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Send Message
              </button>
            </form>

            <div style={styles.contactInfo}>
              <h2 style={styles.infoTitle}>Other Ways to Reach Us</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>General Inquiries</h3>
                  <p style={styles.infoCardText}>info@nrsgirls.com</p>
                </div>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>Support</h3>
                  <p style={styles.infoCardText}>support@nrsgirls.com</p>
                </div>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>Legal/DMCA</h3>
                  <p style={styles.infoCardText}>legal@nrsgirls.com</p>
                </div>
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
    maxWidth: '600px',
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
    marginBottom: '2rem',
  },
  form: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
    marginBottom: '2rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#cccccc',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#0f0f0f',
    border: '1px solid #444',
    borderRadius: '0.375rem',
    color: '#ffffff',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#0f0f0f',
    border: '1px solid #444',
    borderRadius: '0.375rem',
    color: '#ffffff',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#0f0f0f',
    border: '1px solid #444',
    borderRadius: '0.375rem',
    color: '#ffffff',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#ff3366',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  contactInfo: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #333',
  },
  infoTitle: {
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#ffffff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#0f0f0f',
    borderRadius: '0.5rem',
  },
  infoCardTitle: {
    fontSize: '0.875rem',
    color: '#888888',
    marginBottom: '0.5rem',
  },
  infoCardText: {
    color: '#ff3366',
    fontSize: '0.9rem',
  },
  successContainer: {
    textAlign: 'center',
    padding: '3rem',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#22cc88',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    color: '#ffffff',
    margin: '0 auto 1.5rem',
  },
  successText: {
    color: '#cccccc',
    fontSize: '1.125rem',
  },
};
