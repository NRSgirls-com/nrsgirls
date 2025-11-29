import { useState, useEffect } from 'react';

export default function AgeVerification({ children }) {
  const [verified, setVerified] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if age verification is already stored
    const ageVerified = localStorage.getItem('nrsgirls_age_verified');
    if (ageVerified === 'true') {
      setVerified(true);
    } else {
      setShowModal(true);
      setVerified(false);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('nrsgirls_age_verified', 'true');
    setVerified(true);
    setShowModal(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  // Show nothing while checking localStorage
  if (verified === null) {
    return null;
  }

  // Show age gate modal
  if (showModal && !verified) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.logo}>NRSgirls</div>
          <h2 style={styles.title}>Age Verification Required</h2>
          <p style={styles.text}>
            This website contains adult content and is intended for individuals
            18 years of age or older.
          </p>
          <p style={styles.text}>
            By clicking &quot;I am 18 or older&quot;, you confirm that you are at least
            18 years old and agree to our Terms of Service and Privacy Policy.
          </p>
          <div style={styles.buttonContainer}>
            <button onClick={handleVerify} style={styles.verifyButton}>
              I am 18 or older - Enter
            </button>
            <button onClick={handleDeny} style={styles.denyButton}>
              I am under 18 - Exit
            </button>
          </div>
          <p style={styles.disclaimer}>
            By entering, you agree that you are of legal age in your jurisdiction
            to view adult content. NRSgirls.com complies with all applicable laws
            and regulations.
          </p>
        </div>
      </div>
    );
  }

  // User is verified, show content
  return children;
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    padding: '3rem',
    borderRadius: '1rem',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    border: '1px solid #333',
  },
  logo: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ff3366',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  text: {
    color: '#cccccc',
    marginBottom: '1rem',
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  verifyButton: {
    padding: '1rem 2rem',
    backgroundColor: '#ff3366',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  denyButton: {
    padding: '1rem 2rem',
    backgroundColor: '#333333',
    color: '#ffffff',
    border: '1px solid #555',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: '#888888',
    lineHeight: 1.5,
  },
};
