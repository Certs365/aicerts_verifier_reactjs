import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ApiDataProvider } from '../utils/ContextState';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';

  const shareTitle = "Aicerts Certification";
  const shareDescription = "Aicerts Certification details.";
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGE;

  return (
    <ApiDataProvider>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        <title>{shareTitle}</title>
        <meta name="description" content={shareDescription} />
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
      </Head>
      <Component {...pageProps} router={router} />
    </ApiDataProvider>
  );
};

export default App;
