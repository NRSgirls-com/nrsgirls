import '../styles/globals.css';
import AgeVerification from '../components/AgeVerification';

export default function App({ Component, pageProps }) {
  return (
    <AgeVerification>
      <Component {...pageProps} />
    </AgeVerification>
  );
}
