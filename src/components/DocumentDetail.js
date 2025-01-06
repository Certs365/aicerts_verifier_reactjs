import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button} from 'react-bootstrap';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Head from 'next/head';
import  downloadIcon  from "../../assets/downloadIcon.svg";
import  communityIcon  from "../../assets/communityIcon.svg";
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
        // @ts-ignore: Implicit any for children prop

        const handleRedirect = (url) => {
            if (url) {
                window.open(url, '_blank');
            }
        };
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

        let shareUrl = apiData?.Details?.url;
        if(shareUrl) {
             shareUrl = shareUrl.replace('/verify-documents', '');
        }
        
    const shareTitle =  apiData?.message || "Certs365 Blockchain Based Secured Document Verification Platform";

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
                                                                                                                                {/* <div  className='hash-info'>
                                                                                                                                            <div className='hash-wrapper mb-1 mb-md-4'>{apiData?.Details['Certificate Number'] ? apiData?.Details['Certificate Number'] : apiData?.Details['Certification Number'] || apiData?.Details['certificateNumber']}</div>
                                                                                                                                            <div className='hash-info'>{apiData?.Details['Name'] || apiData?.Details['name']}</div>
                                                                                                                                </div> */}
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

                                                            <div className='cerficate-external-info'>

                                                            <Row>
  {customFieldsArray.length > 0 && customFieldsArray.map((field, index) => {
    return (
      <Col xs={6} md={3} key={index}>
        <div className="details ">
          <div className="heading">{Object.keys(field)[0]}</div>
          <div className="heading-info">{Object.values(field)[0]}</div>
        </div>
      </Col>
    );
  })}
   
</Row>
                                                           

                                                            </div>
                                                        </Card>
                                                    
<div className=' d-flex flex-column justify-content-center align-items-center '>
                                              
                                                        {/* <button onClick={()=>{handleShare()}}>share</button> */}
                                                        <Form className='p-md-4 p-md-0 d-flex flex-column-reverse flex-md-column'>

                                                        <div style={{marginTop:"20px"}} className='d-flex flex-column flex-md-row justify-content-center justify-content-md-end align-items-center '>
<Button href={apiData?.Details['Polygon URL'] ? ensureHttp(apiData?.Details['Polygon URL']) : ensureHttp(apiData?.Details['Verify On Blockchain'])} target="_blank" className='golden-upload-verified me-2 mb-2 mb-md-0' >
                                                                        Verify on Blockchain
                                                                    </Button>    
                                                                <Link href="/" onClick={handleLogoClick} className="golden-upload valid-again me-2">Validate Another</Link>
                                                                                                     </div>
                                                        <div className='information text-center align-items-center justify-content-center d-flex flex-column'>
                                                            <span className='d-flex flex-row'>
                                                                Only <strong> PDF </strong> is supported. 
                                                            </span>
                                                                <span>(Upto 2 MB)</span>
                                                            </div>
                                                           
                                                            
                                                           
                                                        </Form>
                                                        <div className='d-flex justify-content-start flex-column mt-4'>
                                                        <div className='d-flex justify-content-center'>
                                                        <hr className='horizontal-line-cert'/>
                                                        </div>
                                                        <p className='share-text'>Share Your Certificate:</p>
                                                        <div className='d-flex flex-row justify-content-center align-items-center mb-4'>
    
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
                                                             <div className='details varification-info'>
                                                             <Button href={apiData?.Details['Polygon URL'] ? ensureHttp(apiData?.Details['Polygon URL']) : ensureHttp(apiData?.Details['Verify On Blockchain'])} target="_blank" className='heading-info' variant="primary">
                                                                                                                                    Verify on Blockchain
                                                                                                                                </Button>                                     
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
                            <div className='bottom-verify-wrapper mt-4  d-flex flex-column align-items-center text-center'>
                                                           <p className='text-footer-verify'><Image src={downloadIcon} alt=''/> Download app to keep track of your credentials. <span onClick={() => handleRedirect(process.env.NEXT_PUBLIC_IOS_LINK)} className='golden_underline'>App Store</span> or <span onClick={() => handleRedirect(process.env.NEXT_PUBLIC_ANDROID_LINK)} className='golden_underline'>Play Store</span></p>
                                                           <p className='text-footer-verify '><Image src={communityIcon} alt=''/>  Join Our Community. <span onClick={() => handleRedirect(process.env.NEXT_PUBLIC_NEWS_LINK)} className='golden_underline'>AI CERTs News</span></p>

                                                        </div>
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
