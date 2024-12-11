import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button} from 'react-bootstrap';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Head from 'next/head';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';

        // @ts-ignore: Implicit any for children prop
function convertToCustomArray(jsonString) {
    // Parse the JSON string
    const jsonObject = JSON.parse(jsonString);
  
    // Initialize an array to store the custom key-value pair objects
    const customArray = [];
  
    // Iterate over each key-value pair in the JSON object
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        // Create a new object with the key-value pair
        const keyValuePair = {};
        // @ts-ignore: Implicit any for children prop
        keyValuePair[key] = jsonObject[key];
  
        // Append the key-value pair object to the array
        customArray.push(keyValuePair);
      }
    }
  
    return customArray;
  }
        // @ts-ignore: Implicit any for children prop

  const ensureHttp = (url) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `http://${url}`;
    }
    return url;
  };
    // @ts-ignore: Implicit any for children prop
    const DocumentDetail = ({ handleFileChange, apiData, isLoading }) => {
        const [progress, setProgress] = useState(0);
        const certificateRef = useRef(null);
        const [certificateImage, setCertificateImage] = useState(null);
        const [shareModal, setShareModal] = useState(false);
        const [copied, setCopied] = useState(false);
        const [customFieldsArray, setCustomFieldsArray] = useState([]);

        const handleClose = () => setShareModal(false);


          
        useEffect(() => {
            if (isLoading) {
                const interval = setInterval(() => {
                    setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 10 : 100));
                }, 500);

                return () => clearInterval(interval);
            } else {
                setProgress(0);
            }
        }, [isLoading]);

        useEffect(() => {
            if (certificateRef.current) {
                toPng(certificateRef.current)
                    .then((dataUrl) => {
                        // @ts-ignore: Implicit any for children prop
                        setCertificateImage(dataUrl);
                    })
                    .catch((error) => {
                        // console.error('Error generating certificate image:', error);
                    });
            }
        }, [apiData]);

        useEffect(() => {
            if (apiData && apiData?.Details && apiData?.Details['Custom Fields']) {
              const customFields = convertToCustomArray(apiData.Details['Custom Fields']);
        // @ts-ignore: Implicit any for children prop
              setCustomFieldsArray(customFields);
            }
            
          }, [apiData]);

        const handleLogoClick = () => {
            window.location.reload();
        };


        // const shareValue = apiData?.Details["Polygon URL"];

        // const copyToClipboard = () => {
        //     navigator.clipboard.writeText(shareValue).then(() => {
        //         setCopied(true)
        //         setTimeout(() => setCopied(false), 3000);
        //     }).catch(err => {
        //         // console.error('Failed to copy text: ', err);
        //     });
        // };

        // @ts-ignore: Implicit any for children prop
        const formatDate = (dateString) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();

            return `${month}/${day}/${year}`;
        };

        let shareUrl = apiData?.Details?.url;
        if(shareUrl) {
             shareUrl = shareUrl.replace('/verify-documents', '');
        }
        
    const shareTitle =  apiData?.message || "Certs365 Blockchain Based Secured Document Verification Platform";

    const title = 'Ai Certificate';
    const description = 'Test description';
    const image = 'https://images.netcomlearning.com/ai-certs/cer365AllPageBg.png';

    

    return (
        <>
         

            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center verify-cert'>
                        <div className='container-fluid'>
                            <Row className="justify-content-center mt-4 verify-documents">
                                <h1 className='title text-center'>{shareTitle}</h1>
                                <Col xs={{ span: 12 }} md={{ span: 10 }}>
                                    <Card className='p-0 p-md-4'>
                                        <Row className='justify-content-center'>
                                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                                {apiData?.Details ? (
                                                    <>
                                                        <Card ref={certificateRef} className='valid-cerficate-info'>
                                                            <Card className='dark-card position-relative'>
                                                                <div className='d-block d-lg-flex justify-content-between align-items-center certificate-internal-info'>
                                                                    <div className='badge-banner'>
                                                                        <Image
                                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                                            layout='fill'
                                                                            objectFit='contain'
                                                                            alt='Badge Banner'
                                                                        />
                                                                    </div>
                                                                    <div className='hash-info'>
                                                                        <Row className='position-relative'>
                                                                            <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                                                <div className='hash-title'>Document Number</div>
                                                                                <div className='hash-info'>{apiData?.Details['Certificate Number'] ? apiData?.Details['Certificate Number'] : apiData?.Details['Certification Number'] || apiData?.Details['certificateNumber']}</div>
                                                                            </Col>
                                                                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                                                                                <div className='hash-title'>Name</div>
                                                                                <div className='hash-info'>{apiData?.Details['Name'] || apiData?.Details['name']}</div>
                                                                            </Col>
                                                                            <hr />
                                                                            <hr className='vertical-line' />
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </Card>

                                                            <div className='cerficate-external-info d-block d-lg-flex  text-md-left text-center mb-md-0 mb-4'>
                                                          {customFieldsArray.length > 0 &&
                                                          
                                                          
                                                            <div className='col-12 col-md-6'>
                                                            <table style={{ backgroundColor: "transparent"}} className='table table-bordered'>
    <tbody>
        {customFieldsArray.map((field, index) => (
            <tr key={index} style={{ backgroundColor: "transparent" }}>
                <td style={{ backgroundColor: "transparent",maxWidth:"200px"  }}>{Object.keys(field)[0]}</td>
                <td style={{ backgroundColor: "transparent",maxWidth:"200px" }}>{Object.values(field)[0]}</td>
            </tr>
        ))}
    </tbody>
</table>

                                                        </div>
                                                          }

<div className={`col-12 ${customFieldsArray?.length >0 ? "col-md-6" : "col-md-12"}`}>
                                                                <div className='details varification-info'>
                                                                    <Button href={apiData?.Details['Polygon URL'] ? ensureHttp(apiData?.Details['Polygon URL']) : ensureHttp(apiData?.Details['Verify On Blockchain'])} target="_blank" className='heading-info' variant="primary">
                                                                        Verify on Blockchain
                                                                    </Button>
                                                                </div>

                                                                <Form className='p-4 p-md-0'>
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                <Link href="/" onClick={handleLogoClick} className="golden-upload valid-again">Validate Another</Link>
                                                            </div>
                                                            <div className='information text-center'>
                                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                            </div>
                                                        </Form>
                                                                <div className='d-flex justify-content-center mt-4'>
                                                        <p className='share-text'>Share Your Certificate:</p>
                                                        </div>
                                                        <div className='d-flex justify-content-center align-items-center '>
                                                            <FacebookShareButton style={{marginRight:"5px"}} url={shareUrl} title={shareTitle} className='mr-5'>
                                                                <FacebookIcon size={32} round />
                                                            </FacebookShareButton>
                                                            <TwitterShareButton  style={{marginRight:"5px"}}  url={shareUrl} title={shareTitle} className='mr-2'>
                                                                <TwitterIcon size={32} round />
                                                            </TwitterShareButton>
                                                            <LinkedinShareButton  style={{marginRight:"5px"}}  url={shareUrl} title={shareTitle} className='mr-2'>
                                                                <LinkedinIcon size={32} round />
                                                            </LinkedinShareButton>
                                                            
                                                        </div>
                                                        </div>
                                                            </div>
                                                        </Card>
                                                       
                                                        <div className='d-flex justify-content-center'>
                                                        <hr className='horizontal-line-cert'/>
                                                        </div>
                                                       
                                                      
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='badge-banner'>
                                                            <Image
                                                                src="/backgrounds/invalid-certificate.gif"
                                                                layout='fill'
                                                                objectFit='contain'
                                                                alt='Badge Banner'
                                                            />
                                                        </div>
                                                        <Form>
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                <label htmlFor="fileInput" className="golden-upload">Validate again</label>
                                                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                                                            </div>
                                                            <div className='information text-center pb-md-0 pb-4'>
                                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                            </div>
                                                        </Form>
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>

            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/certification-loader.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <ProgressBar now={progress} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DocumentDetail;
