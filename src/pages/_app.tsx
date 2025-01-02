import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useContext, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import "boxicons/css/boxicons.min.css";
import { ApiDataProvider, ApiDataContext } from '../utils/ContextState'; // Updated import path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
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


    const shareTitle = "Certs365 Blockchain Based Secured Document Verification Platform";
    const shareDescription = "Online authenticity verification of certificates and documents is simple with Cert365. Our platform for blockchain-based certificate verification is user-friendly and safe.";



    return (
      <>
        <Component {...pageProps} router={router} />
      </>
    );
  };

  const [isBotOpen, setBotOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleBot = () => {
    setBotOpen(!isBotOpen);
    setLoading(true);
  };
  return (
    <ApiDataProvider>
      <Layout />
      <ToastContainer />
      <div className="bot-icon" onClick={toggleBot}>
        <img src={isBotOpen ? "/BotCross.png" : "/BotIcon.png"} alt="Chatbot" />
      </div>
      {isBotOpen && (
        <div className="bot-iframe-container">
          {/* Loader */}
          {loading && (
            <div className="iframe-loader">
              <ClipLoader color="#555" size={40} />
            </div>
          )}
          <iframe
            src="https://app.xbot365.io/widget/c489775bb3824445b3291d6be38a23fb"
            frameBorder="0"
            allow="clipboard-read; clipboard-write"
            onLoad={() => setLoading(false)}
          ></iframe>
        </div>
      )}
    </ApiDataProvider>
  );
};

export default App;
