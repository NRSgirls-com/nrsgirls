import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  const [activeTab, setActiveTab] = useState('performer');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    stageName: '',
    genre: '',
    experience: '',
    interests: '',
    agreeTerms: false,
    agreeAge: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeTerms || !formData.agreeAge) {
      setError('Please agree to the terms and confirm your age.');
      return;
    }

    // In production, this would POST to an API endpoint
    // For now, we'll simulate successful submission
    try {
      // Simulated API call - replace with actual endpoint
      console.log('Registration submitted:', { type: activeTab, ...formData });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Registration Submitted - NRSgirls</title>
        </Head>
        <div style={styles.pageWrapper}>
          <Header />
          <main style={styles.main}>
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <h1 style={styles.successTitle}>Thank You!</h1>
              <p style={styles.successText}>
                Your {activeTab === 'performer' ? 'Performer' : 'DJ'} interest registration
                has been submitted successfully.
              </p>
              <p style={styles.successSubtext}>
                We&apos;ll be in touch soon with more information about joining the
                NRSgirls platform. Check your email for confirmation.
              </p>
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
        <title>Join NRSgirls - Performer & DJ Registration</title>
        <meta name="description" content="Register your interest to join NRSgirls as a Performer or DJ" />
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.main}>
          <div style={styles.container}>
            <h1 style={styles.title}>Join NRSgirls</h1>
            <p style={styles.subtitle}>
              Register your interest to be part of the premier DJ + Performer platform
            </p>

            {/* Tab Selection */}
            <div style={styles.tabContainer}>
              <button
                onClick={() => setActiveTab('performer')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'performer' ? styles.tabActive : {})
                }}
              >
                I&apos;m a Performer
              </button>
              <button
                onClick={() => setActiveTab('dj')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'dj' ? styles.tabActive : {})
                }}
              >
                I&apos;m a DJ
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <div style={styles.error}>{error}</div>}

              {/* Common Fields */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
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
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Your legal name (kept private)"
                />
              </div>

              {/* Performer-specific Fields */}
              {activeTab === 'performer' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Stage Name</label>
                    <input
                      type="text"
                      name="stageName"
                      value={formData.stageName}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Your performer name (optional)"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Performance Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="">Select experience level</option>
                      <option value="new">New to performing</option>
                      <option value="some">Some experience (1-2 years)</option>
                      <option value="experienced">Experienced (3+ years)</option>
                      <option value="professional">Professional performer</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tell us about yourself</label>
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      style={styles.textarea}
                      placeholder="What interests you about performing on NRSgirls? What makes you unique?"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* DJ-specific Fields */}
              {activeTab === 'dj' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>DJ/Artist Name *</label>
                    <input
                      type="text"
                      name="stageName"
                      value={formData.stageName}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="Your DJ name"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Primary Genre</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="">Select your primary genre</option>
                      <option value="house">House</option>
                      <option value="techno">Techno</option>
                      <option value="edm">EDM</option>
                      <option value="hiphop">Hip-Hop / R&B</option>
                      <option value="dnb">Drum & Bass</option>
                      <option value="trance">Trance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>DJ Experience</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="">Select experience level</option>
                      <option value="bedroom">Bedroom DJ</option>
                      <option value="local">Local gigs (1-2 years)</option>
                      <option value="regional">Regional artist (3+ years)</option>
                      <option value="professional">Professional touring DJ</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tell us about your sound</label>
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      style={styles.textarea}
                      placeholder="Describe your DJ style and what excites you about the Global Audio Bus concept"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* Agreements */}
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreeAge"
                    checked={formData.agreeAge}
                    onChange={handleChange}
                    required
                    style={styles.checkbox}
                  />
                  <span>I confirm that I am 18 years of age or older *</span>
                </label>
              </div>

              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    style={styles.checkbox}
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy *
                  </span>
                </label>
              </div>

              <button type="submit" style={styles.submitButton}>
                Submit {activeTab === 'performer' ? 'Performer' : 'DJ'} Registration
              </button>
            </form>

            {/* Vision Statement */}
            <div style={styles.visionSection}>
              <h2 style={styles.visionTitle}>The NRSgirls Vision</h2>
              <p style={styles.visionText}>
                NRSgirls is pioneering the future of live entertainment through our
                revolutionary <strong>Global Audio Bus</strong> technology. We&apos;re
                creating a platform where professional DJs provide synchronized audio
                experiences that performers can tap into anywhere in the world.
              </p>
              <p style={styles.visionText}>
                Imagine performing to curated, high-quality DJ sets instead of generic
                playlists. Imagine being a DJ whose mixes power performances across
                the globe. That&apos;s NRSgirls.
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
    padding: '2rem 1rem',
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
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  tab: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '0.5rem',
    color: '#888888',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#ff3366',
    borderColor: '#ff3366',
    color: '#ffffff',
  },
  form: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #333',
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
  checkboxGroup: {
    marginBottom: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    color: '#cccccc',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  checkbox: {
    marginTop: '0.25rem',
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
    marginTop: '1rem',
    transition: 'background-color 0.2s',
  },
  error: {
    backgroundColor: '#ff336622',
    border: '1px solid #ff3366',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    color: '#ff6699',
  },
  successContainer: {
    maxWidth: '500px',
    margin: '4rem auto',
    textAlign: 'center',
    padding: '2rem',
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
  successTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  successText: {
    fontSize: '1.125rem',
    color: '#cccccc',
    marginBottom: '0.5rem',
  },
  successSubtext: {
    color: '#888888',
  },
  visionSection: {
    marginTop: '3rem',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '0.75rem',
    border: '1px solid #333',
  },
  visionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#ff3366',
  },
  visionText: {
    color: '#cccccc',
    lineHeight: 1.7,
    marginBottom: '1rem',
  },
};
