import React, { useEffect, useState} from 'react';
import UploadCertificate from './upload-certificate';
import Navigation from '@/app/navigation';
import certificate from '../services/certificateServices';
import DocumentsValid from './documents-valid';

const VerifyDocuments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState({
        message: "",
        detailsQR: {}
    });
    const [loginError, setLoginError] = useState('');
    const [show, setShow] = useState(false);



    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // @ts-ignore: Implicit any for children prop
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (selectedFile) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);

                const response = await fetch(`${apiUrl}/api/verify`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json(); // Assuming response is in JSON format
                setApiData(responseData);

            } catch (error) {
                // console.error('Error uploading file:', error);
                // Handle error
            } finally {
                setIsLoading(false);
            }
        }
    };

     // @ts-ignore: Implicit any for children prop
     const verifyUrl = async (certificateNumber) => {
        try {
            if (certificateNumber) {
                setIsLoading(true);

                // First API call with certificateNumber
                const certificateResponse = await fetch(`${apiUrl}/api/verify-certification-id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: certificateNumber,
                    }),
                });

                if (certificateResponse.ok) {
                    const certificateData = await certificateResponse.json();
                    // Assuming response is in JSON format
                    setApiData({
                        // @ts-ignore: Implicit any for children prop
                        Details: certificateData?.details,
                        message: certificateData?.message
                    });
                }
                else{
                    const errorData = await certificateResponse.json();
                    if(errorData.message=='Certification has revoked') {
                        router.push('/certificate-revoked')
                        return
                    }
                }
            } else {
               
                // Handle error as needed
                setLoginError("Certification Number and PDF is required")
                setShow(true)
            }
        } catch (error) {
            // console.error('Error during API calls:', error);
            setLoginError("Unable to verify the certification. Please review and try again.")
            setShow(true)
            // Handle error as needed
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Extract encrypted link from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const qValue = urlParams.get('q');
        const ivValue = urlParams.get('iv');

        if (qValue && ivValue) {
            handleVerifyCertificate(qValue, ivValue);
        } else {
            // Extract the certificate number from the URL if present
            const url = window.location.href;
            const match = url.match(/=(\w+)/);
            if (match) {
                const certificateNumber = match[1]; // Extract number after '='
                verifyUrl(certificateNumber);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    // @ts-ignore: Implicit any for children prop
    const handleVerifyCertificate = (qValue, ivValue) => {
        // Call the verify API with the encrypted link
        const data = {
            qValue, ivValue
        }
        setIsLoading(true)

        certificate?.verifyCertificate(data, (response) => {
            // Handle the API response here (success or error)

            if (response.status == "SUCCESS") {
                if (response.data.status === 'PASSED') {
                    // @ts-ignore: Implicit any for children prop
                    setApiData((prevData) => {
                        // Perform actions based on prevData and update state
                        return {
                            message: "Certificate is Valid",
                            Details: response.data.data
                        };
                    });

                    // @ts-ignore: Implicit any for children prop
                    setData(response.data.data)

                    setIsLoading(false)

                } else if (response.data.status === 'FAILED') {
                    // @ts-ignore: Implicit any for children prop
                    setApiData((prevData) => {
                        // Perform actions based on prevData and update state
                        return {
                            message: "Certificate is not Valid",
                        };
                    });
                    setIsLoading(false)
                } else {
                    // Handle verification error
                    // console.error('Verification failed!', response.error);
                }
            } else {
                // console.error('Verification failed!', response.error);
            }


            setIsLoading(false);
        });
    };


    return (
        <div>
            <Navigation />
            {apiData ? (
            <>
                <DocumentsValid handleFileChange={handleFileChange} apiData={apiData} isLoading={isLoading} />
            </>
        ) : (
            <UploadCertificate
            // @ts-ignore: Implicit any for children prop
                handleFileChange={handleFileChange}
                isLoading={isLoading}
                apiUrl={apiUrl}
                setApiData={setApiData}
                apiDataVerify={apiData}
            />
        )}
        </div>
    );
}

export default VerifyDocuments;
