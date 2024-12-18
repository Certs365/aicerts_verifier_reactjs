import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import Button from '../../../shared/button/button';

// @ts-ignore
const CertificateTemplateOne = ({ apiData }) => {
    const [html2pdfModule, setHtml2pdfModule] = useState(null);

    // Load html2pdf.js only on the client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            // @ts-ignore
            import('html2pdf.js').then((module) => {
                setHtml2pdfModule(module);
            });
        }
    }, []);

    // const handleDownload = () => {
    //     if (html2pdfModule) {
    //         const element = document.getElementById('template-6');

    //         // Create a clone of the element to modify dimensions for PDF generation
    //         const clonedElement = element.cloneNode(true);
    //         clonedElement.style.width = '1009px';
    //         clonedElement.style.height = '720px'; // Adjust height according to content

    //         document.body.appendChild(clonedElement); // Append temporarily to generate PDF

    //         // Configure html2pdf settings for fixed size
    //         html2pdfModule.default()
    //             .set({
    //                 margin: 0,
    //                 filename: `Certificate_${apiData?.Details['name']}.pdf`,
    //                 html2canvas: { scale: 1 },
    //                 jsPDF: { unit: 'px', format: [1920, clonedElement.clientHeight], orientation: 'landscape' }
    //             })
    //             .from(clonedElement)
    //             .save()
    //             .finally(() => {
    //                 document.body.removeChild(clonedElement); // Clean up after generating the PDF
    //             });
    //     }
    // };

    const handleDownload = () => {
        if (html2pdfModule) {
            const element = document.getElementById('template-6');

            // Create a clone of the element to modify dimensions for PDF generation
            // @ts-ignore
            const clonedElement = element.cloneNode(true);
            // @ts-ignore
            clonedElement.style.width = '1009px';
            // @ts-ignore
            clonedElement.style.height = '720px'; // Adjust height according to content

            // Add inline styles to override media queries
            const clonedStyles = document.createElement('style');
            clonedStyles.innerHTML = `
                .certificate-template {
                    background-size: cover;
                    width: 1009px;
                    height: 720px;
                    margin: auto;
                    font-family: 'Kanit', sans-serif;
                }
                .certificate-template#template-6 {
                    background-image: url(/backgrounds/certificate-template-6-bg.svg);
                    padding: 32px 0 5.625em;
                }
                .certificate-template#template-6 .badge-position {
                    bottom: 240px;
                }
                .certificate-template#template-6 .bottom-info {
                    bottom: 190px;
                }
                .certificate-template .hero-logo img {
                    width: auto;
                    height: 48px;
                }
                .certificate-template .hero-info {
                    color: #4d4d4d;
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 28px;
                    letter-spacing: 0.04em;
                    margin: 30px 0 0;
                }
                .certificate-template .issued-to {
                    color: #0c393d;
                    font-size: 32px;
                    font-weight: 600;
                    line-height: 50px;
                    letter-spacing: 0.04em;
                    text-transform: capitalize;
                }
                .certificate-template .hero-message {
                    color: #4d4d4d;
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 36px;
                    letter-spacing: 0.01em;
                    margin: 20px 0 0;
                }
                .certificate-template .course-name {
                    color: #0c393d;
                    font-size: 32px;
                    font-weight: 600;
                    line-height: 40px;
                    letter-spacing: 0.04em;
                }
                .certificate-template .issued-by {
                    width: 355px;
                    margin: 60px auto 0;
                }
                .certificate-template .issued-by .signature img {
                    width: 217px;
                    height: 58px;
                    margin: auto;
                }
                .certificate-template .issued-by hr {
                    height: 2px;
                    border: 1px solid #b2b2b2;
                    margin: 20px 0 8px;
                }
                .certificate-template .issued-by .issuer-info .issuer-name {
                    color: #000;
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 27px;
                    letter-spacing: 0em;
                    position: relative;
                }
                .certificate-template .issued-by .issuer-info .issuer-name::after {
                    content: '';
                    position: absolute;
                    top: 7px;
                    right: -10px;
                    width: 2px;
                    height: 16px;
                    background-color: #000;
                }
                .certificate-template .issued-by .issuer-info .issuer-designation {
                    color: #707070;
                    font-size: 18px;
                    font-weight: 400;
                    line-height: 27px;
                    letter-spacing: 0.01em;
                }
                .certificate-template .badge-position {
                    left: 165px;
                    bottom: 154px;
                }
                .certificate-template .badge-position .ai-badge-logo img {
                    width: 130px;
                    height: 130px;
                }
                .certificate-template .bottom-info {
                    bottom: 80px;
                }
                .certificate-template .bottom-info .certificate-info {
                    color: #000;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: left;
                    letter-spacing: 0.03px;
                    text-transform: capitalize;
                }
                .certificate-template .bottom-info span {
                    color: #4d4d4d;
                    width: 2px;
                    display: block;
                    margin: 0 10px;
                }
                .certificate-template .qr-details {
                    position: absolute;
                    right: 165px;
                    bottom: 230px;
                }
                .certificate-template .qr-details img {
                    width: 171px;
                    height: 172px;
                }
            `;
            clonedElement.appendChild(clonedStyles);

            document.body.appendChild(clonedElement); // Append temporarily to generate PDF

            // Configure html2pdf settings for fixed size
            // @ts-ignore
            html2pdfModule.default()
                .set({
                    margin: 0,
                    filename: `Certificate_${apiData?.Details['name'] || apiData?.Details['Name'] }.pdf`,
                    html2canvas: { scale: 2 }, // Increase scale for better quality
                    jsPDF: { unit: 'px', format: [1009, 720], orientation: 'landscape' }
                })
                .from(clonedElement)
                .save()
                .finally(() => {
                    document.body.removeChild(clonedElement); // Clean up after generating the PDF
                });
        }
    };

    return (
        <div className='page-bg'>
            <div className='position-relative h-100'>
                <div className='vertical-center verify-cert'>
                    <div className='container py-5'>
                        <div className='certificate-template position-relative' id="template-6">
                            <div className='hero-logo text-center' style={{paddingTop:"0%"}}>
                            <Image
  src="https://images.netcomlearning.com/ai-certs/Certs365-logo.svg"
  alt="AI Certs logo"
 layout='fill'
/>
                            </div>
                            {/* <div className='hero-info text-center' style={{paddingTop:"3%"}}>This is to certify that</div> */}
                            <div className='issued-to text-center'style={{paddingTop:"14%",paddingRight:"50%",fontSize:"xx-large"}}>{apiData?.Details['name'] || apiData?.Details['Name']}</div>
                            {/* <div className='hero-message text-center' style={{paddingTop:"0%"}}>Has successfully Pass the Exam</div> */}
                            <div className='course-name text-center' style={{paddingTop:"5%",paddingRight:"50%",fontSize:"xx-large"}}>{apiData?.Details['title'] || apiData?.Details['Course Name']}</div>
                            <div className='qr-details'>
                                <div className='qr-wrapper' style={{ paddingLeft: "40%", paddingBottom: "100%" }}>
                                
                                <Image
  src={apiData?.Details['qrUrl'] || '/fallback-image.png'} // Fallback image if `qrUrl` is undefined
  alt="QR Code"
  width={130}
  height={130}
/>
                                </div>
                            </div>
                            <div className='issued-by text-center' style={{paddingTop:"15%"}}>
                                <div className='signature'>
                                    {/* eslint-disable-next-line */}
                                    <img
                                        src='/backgrounds/russel-signature.svg'
                                        alt='Russel Sarder'
                                    />
                                </div>
                                <div className='issuer-info d-flex justify-content-between align-items-center' style={{paddingBottom:"3%"}}>
                                    <div className='issuer-name'>Russell Sarder</div>
                                    <div className='issuer-designation'>Chairman & CEO, AI Certs<sup>&trade;</sup></div>
                                </div>
                            </div>
                            {/* <div className='badge-position position-absolute'>
                                <div className='ai-badge-logo'> */}
                                    {/* eslint-disable-next-line */}
                                    {/* <img
                                        src='/backgrounds/bitcoin-certified-trainer-badge.svg'
                                        alt='Russel Sarder'
                                    />
                                </div>
                            </div> */}
                            <div className='bottom-info d-flex justify-content-center align-items-center w-100 position-absolute' style={{paddingBottom:"4%",paddingRight:"20%"}} >
                            <div className='certificate-info' style={{color:"white",paddingRight:"13%",fontSize:"medium"}}>Certificate No.: {apiData?.Details['tid'] || apiData?.Details['Certificate Number']}</div>

                           
                            <div className='certificate-info' style={{color:"white",paddingRight:"5%",fontSize:"medium"}}>Grant Date: {apiData?.Details['endTime'] || apiData?.Details['Grant Date']}</div>

                                {/* <span>|</span> */}
                                {/* <div className='certificate-info' >Exam Start Time: {apiData?.Details['startTime']}</div> */}
                                {/* <span>|</span> */}
                            </div>
                        </div>
                        <div className='text-center mt-3'>
                            <Button className='golden-upload download' label='Download' onClick={handleDownload} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CertificateTemplateOne;