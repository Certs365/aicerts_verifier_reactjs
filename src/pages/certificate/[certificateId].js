import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

const CertificateId = () => {
  const router = useRouter();
  const { certificateId } = router.query;
  const shareTitle = "Aicerts Certification";
  const shareDescription = "Aicerts Certification details.";
  return (
    <>
      <Head>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={shareTitle} />
                <meta property="og:description" content={shareDescription} />
                <meta property="og:url" content={`https://testverify.certs365.io/certificate/${certificateId}`} />
                <meta property="og:image" content={`https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/${certificateId}.png`} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={shareTitle} />
                <meta name="twitter:description" content={shareDescription} />
                <meta name="twitter:image" content={`https://certs365-live.s3.amazonaws.com/dynamic_bulk_issues/${certificateId}.png`} />
                <title>AI Certificate</title>
                <meta name="description" content={shareDescription} />
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
            </Head>
    <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Image 
        src={`/uploads/${certificateId}.png`}
        layout='fill'
        objectFit='contain'
        />
    </div>
        </>
  );
};

export default CertificateId;
