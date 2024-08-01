import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CertificateContext from '@/utils/CertificateContext';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';

  const shareTitle = "Aicerts Certification";
  const [metaDetails, setMetaDetails] = useState({
    Details: {
      'Course Name': "",
      certificateUrl: "",
      url: ""
    },
    message: ""
  });

  useEffect(()=>{
console.log(metaDetails,"meta")
console.log(encodeURIComponent(metaDetails?.Details['certificateUrl']),"meta")
  },[metaDetails])

 

  return (
    // @ts-ignore: Implicit any for children props
    <CertificateContext.Provider value={{ metaDetails, setMetaDetails:setMetaDetails }}>
      <Head>
      <title>{shareTitle}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={encodeURIComponent(metaDetails?.Details['Course Name'])} />
        <meta property="og:image" content={encodeURIComponent(metaDetails?.Details['certificateUrl'])} />
        <meta property="og:image:secure_url" content={encodeURIComponent(metaDetails?.Details['certificateUrl'])} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={encodeURIComponent(metaDetails?.Details['Course Name'])} />
        <meta name="twitter:image" content={encodeURIComponent(metaDetails?.Details['certificateUrl'])} />
        <meta name="description" content={encodeURIComponent(metaDetails?.Details['Course Name'])} />
        <meta property="og:url" content={encodeURIComponent(metaDetails?.Details['url'])} />
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
      </Head>
      <Component {...pageProps} router={router} />
    </CertificateContext.Provider>
  );
};

export default App;
