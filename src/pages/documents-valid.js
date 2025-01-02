import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button} from 'react-bootstrap';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Head from 'next/head';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton,  TwitterIcon, LinkedinIcon, FacebookIcon } from 'react-share';
import  facebookIcon  from "../../assets/facebookicon.png"
import  linkedIcon  from "../../assets/linkedin.png"
import  twitterIcon  from "../../assets/twitter.png"
import  iosIcon  from "../../assets/App Store.png";
import  androidIcon  from "../../assets/Play.png";

    // @ts-ignore: Implicit any for children prop
    const DocumentsValid = ({ handleFileChange, apiData, isLoading }) => {
        const [progress, setProgress] = useState(0);
        const certificateRef = useRef(null);
        const [certificateImage, setCertificateImage] = useState(null);
        const [shareModal, setShareModal] = useState(false);
        const [copied, setCopied] = useState(false);

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

        const handleLogoClick = () => {
            window.location.reload();
        };

                        // @ts-ignore: Implicit any for children prop

        const ensureHttp = (url) => {
            if (!url) return '';
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              return `http://${url}`;
            }
            return url;
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
        // @ts-ignore: Implicit any for children prop

        const handleRedirect = (url) => {
            if (url) {
                window.open(url, '_blank');
            }
        };
       
        
    const shareTitle =  apiData?.message || "Certs365 Blockchain Based Secured Document Verification Platform";

    const title = 'Certs365 Blockchain Based Secured Document Verification Platform';
    const description = "Online authenticity verification of certificates and documents is simple with Cert365. Our platform for blockchain-based certificate verification is user-friendly and safe.";
    const image = 'https://images.netcomlearning.com/ai-certs/cer365AllPageBg.png';
    const imageUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGE;
 

    // const imageUrl = apiData?.Details && `https://testverify.certs365.io/api/og?certificatenumber=${apiData?.Details['Certificate Number']}&coursename=${apiData?.Details['Course Name']}&grantdate=${(apiData?.Details['Grant Date'] || apiData?.Details['grantDate'])}&expirationdate=${(apiData?.Details['Expiration Date'] || apiData?.Details['expirationDate'])}&name=${apiData?.Details['Name']}`;
    // const certificateUrl = `https://testverify.certs365.io/certificate/${apiData?.Details['Certificate Number']}?certificatenumber=${apiData?.Details['Certificate Number']}&coursename=${apiData?.Details['Course Name']}&grantdate=${(apiData?.Details['Grant Date'] || apiData?.Details['grantDate'])}&expirationdate=${(apiData?.Details['Expiration Date'] || apiData?.Details['expirationDate'])}&name=${apiData?.Details['Name']}`;
    let shareUrl = apiData?.Details?.url || "";
    if(shareUrl) {
         shareUrl = shareUrl.replace('/verify-documents', '');
    }
    return (
        <>
          
           <Head>
           <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:secure_url" content={imageUrl} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content='website' />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />
                <meta name="description" content={description} />

            </Head>

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
                                                                <div  className='d-block d-flex  align-items-center certificate-internal-info'>
                                                                    <div className='badge-banner d-none d-md-flex'>
                                                                        <Image
                                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                                            layout='fill'
                                                                            objectFit='contain'
                                                                            alt='Badge Banner'
                                                                        />
                                                                    </div>
                                                                    <div className='d-md-none'>
                                                                        <Image
                                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                                            width={74}
                                                                            height={74}
                                                                            objectFit='contain'
                                                                            alt='Badge Banner'
                                                                        />
                                                                    </div>
                                                                    <div  className='hash-info'>
                                                                                <div className='hash-wrapper mb-1 mb-md-4'>{apiData?.Details['Certificate Number'] ? apiData?.Details['Certificate Number'] : apiData?.Details['Certification Number'] || apiData?.Details['certificateNumber']}</div>
                                                                                <div className=' hash-text'>{apiData?.Details['Course Name'] ? apiData?.Details['Course Name'] : apiData?.Details['Certification Name'] || apiData?.Details['course']}</div>
                                                                    </div>
                                                                </div>
                                                            </Card>

                                                            <div className='cerficate-external-info d-block d-lg-flex justify-content-between align-items-center text-md-left  mb-md-0 '>
                                                                <div className='details '>
                                                                    <div className='heading'>Name</div>
                                                                    <div className='heading-info'>{apiData?.Details['Name'] || apiData?.Details['name']}</div>
                                                                </div>
                                                                <div className='details d-flex flex-row justify-content-between'>
                                                                    <div>
                                                                    <div className='heading'>Grant Date</div>
                                                                    <div className='heading-info'>{formatDate(apiData?.Details['Grant Date'] || apiData?.Details['grantDate'])}</div>
                                                                    </div>
                                                                  
                                                                    <div className='d-flex flex-column d-md-none'>

                                                                    <div className='heading'>Expiration Date</div>
                                                                    <div className='heading-info'>
                                                                        {apiData?.Details['Expiration Date'] === "1" || apiData?.Details['expirationDate'] === "1" ? "-" : formatDate(apiData?.Details['Expiration Date'] || apiData?.Details['expirationDate']) || 'No Expiration Date available'}
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                <div className='details d-none d-md-flex flex-column'>
                                                                    <div className='heading'>Expiration Date</div>
                                                                    <div className='heading-info'>
                                                                        {apiData?.Details['Expiration Date'] === "1" || apiData?.Details['expirationDate'] === "1" ? "-" : formatDate(apiData?.Details['Expiration Date'] || apiData?.Details['expirationDate']) || 'No Expiration Date available'}
                                                                    </div>
                                                                </div>

                                                                <div className='details varification-info'>
                                                                    <Button href={apiData?.Details['Polygon URL'] ? ensureHttp(apiData?.Details['Polygon URL']) : ensureHttp(apiData?.Details['Verify On Blockchain'])} target="_blank" className='heading-info' variant="primary">
                                                                        Verify on Blockchain
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                        <div className='d-flex flex-column-reverse flex-md-row justify-content-between align-items-center '>
                                                        <div className='d-flex justify-content-start flex-column mt-4'>
                                                        <p className='share-text'>Share Your Certificate:</p>
                                                        <div className='d-flex flex-row'>
    {/* <FacebookShareButton url={shareUrl}>
    <div className='icon-button-wrapper'>
            <Image src={facebookIcon} alt='facebookicon' />
    </div>
                                </FacebookShareButton>
                                <LinkedinShareButton url={shareUrl} title={title} summary={description} source="Certs365">
                                      <div className='icon-button-wrapper'>
            <Image src={linkedIcon} alt='linkedinicon' />
    </div>
                                </LinkedinShareButton>
                                <TwitterShareButton url={shareUrl} title={title}>
                                <div className='icon-button-wrapper'>
            <Image src={twitterIcon} alt='twittericon' />
    </div>
                                </TwitterShareButton> */}
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
                                                        {/* <button onClick={()=>{handleShare()}}>share</button> */}
                                                        <Form className='p-md-4 p-md-0 d-flex flex-column-reverse flex-md-column'>
                                                        <div className='information text-center'>
                                                                Only <strong>PDF</strong> is supported. (Upto 2 MB)
                                                            </div>
                                                            <div className='d-flex justify-content-center justify-content-md-end align-items-center'>
                                                                <Link href="/" onClick={handleLogoClick} className="golden-upload valid-again">Validate Another</Link>
                                                            </div>
                                                           
                                                        </Form>
                                                        </div>
                                                        <div className='bottom-verify-wrapper mt-4 d-flex flex-column  align-items-center text-center'>
                                                            <p className='d-flex text-center text-verify'>
                                                            Download our app to access and verify all your certificates in one place.
                                                            </p>
                                                            <div className='d-flex flex-row justify-content-center'>
                                                            <div
    onClick={() => handleRedirect(process.env.NEXT_PUBLIC_IOS_LINK)}
    className="mobile-link-wrapper d-flex justify-content-center align-items-center me-3"
>
    <Image className="responsive-image" src={iosIcon} alt="iosicon" />
</div>
<div
    onClick={() => handleRedirect(process.env.NEXT_PUBLIC_ANDROID_LINK)}
    className="d-flex justify-content-center align-items-center mobile-link-wrapper"
>
    <Image className="responsive-image" src={androidIcon} alt="iosicon" />
</div>

                                                            </div>
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
                                                                Only <strong>PDF</strong> is supported. (Upto 2 MB)
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

export default DocumentsValid;

