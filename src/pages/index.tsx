import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Head from 'next/head';
import Navigation from '@/app/navigation';
import ScanDocuments from "@/pages/scan-qr";

interface Props {
    ogImage: string | null;
    shareTitle: string;
    shareDescription: string;
}

const LoginPage: React.FC<Props> = ({ ogImage, shareTitle, shareDescription }) => {
    return (
        <>
            <Head>
                <title>{shareTitle}</title>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={shareTitle} />
                <meta property="og:description" content={shareDescription} />
                <meta property="og:image" content={ogImage || ""} />
                <meta property="og:image:secure_url" content={ogImage || ""} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={shareTitle} />
                <meta name="twitter:description" content={shareDescription} />
                <meta name="twitter:image" content={ogImage || ""} />
                <meta name="description" content={shareDescription} />
                <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
            </Head>
            <Navigation />
            <div className="container">
                <ScanDocuments />
            </div>
        </>
    );
};

export async function getServerSideProps(context: any) {
    const { query } = context;
    const certId = query['']; // Extract the certificate ID from the query parameter
    let ogImage = null;
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const shareTitle = "Certs365 Blockchain Based Secured Document Verification Platform";
    const shareDescription = "Online authenticity verification of certificates and documents is simple with Cert365. Our platform for blockchain-based certificate verification is user-friendly and safe.";

    // Check if the URL format matches
    if (certId) {
        try {
            // Replace with your actual API endpoint
            const res = await fetch(`${apiUrl}/api/verify-certification-id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: certId,
                }),
            });
            const data = await res.json();
            // Set the OG image based on the API response
            ogImage = data?.details?.certificateUrl || process.env.NEXT_PUBLIC_BASE_URL_IMAGE;
            if(ogImage){
                ogImage += `?t=${new Date().getTime()}`;
            }
        } catch (error) {
            console.error("Error fetching API data:", error);
        }
    }

    return {
        props: {
            ogImage,
            shareTitle,
            shareDescription,
        },
    };
}

export default LoginPage;
