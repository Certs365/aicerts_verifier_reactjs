import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useContext } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ApiDataProvider, ApiDataContext } from '../utils/ContextState'; // Updated import path

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  
  // Move this inside ApiDataProvider so that it gets the context after it's provided
  const Layout = () => {
    const { apiData } = useContext(ApiDataContext);

    const isLoginPage = router.pathname === '/';
    // const imageUrl = apiData?.Details
    //   ? `https://testverify.certs365.io/api/og?certificatenumber=${apiData?.Details['Certificate Number']}&coursename=${apiData?.Details['Course Name']}&grantdate=${apiData?.Details['Grant Date'] || apiData?.Details['grantDate']}&expirationdate=${apiData?.Details['Expiration Date'] || apiData?.Details['expirationDate']}&name=${apiData?.Details['Name']}`
    //   : null;
    const imageUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGE;


    const shareTitle = "Aicerts Certification";
    const shareDescription = "Aicerts Certification details.";

    return (
      <>
       
        <Head>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={shareTitle} />
          <meta property="og:description" content={shareDescription} />
          <meta property="og:image" content={imageUrl || ""} />
          <meta property="og:image:secure_url" content={imageUrl || ""} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={shareTitle} />
          <meta name="twitter:description" content={shareDescription} />
          <meta name="twitter:image" content={imageUrl || ""} />
          <title>{shareTitle}</title>
          <meta name="description" content={shareDescription} />
          <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
        </Head>
        <Component {...pageProps} router={router} />
      </>
    );
  };

  return (
    <ApiDataProvider>
      <Layout />
    </ApiDataProvider>
  );
};

export default App;
