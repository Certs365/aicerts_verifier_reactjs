// ignore

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

    const handleDownload = async () => {
      const certificateDetails = {
        backgroundImageUrl: "https://certs365-live.s3.amazonaws.com/uploads/Certificate%20of%20Participation%2002.png",
        name: apiData?.Details['name'] || apiData?.Details['Name'],
        courseName: apiData?.Details['title'] || apiData?.Details['Course Name'],
        qrUrl: apiData?.Details['qrUrl'],
        certificateId:apiData?.Details['tid'] || apiData?.Details['Certificate Number'],
        grantDate:apiData?.Details['endTime'] || apiData?.Details['Grant Date']
      };
  
      try {
        const response = await fetch('/api/generateCertificate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ certificateDetails }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate_${certificateDetails.certificateId}.pdf`; // Set the filename for the PDF
        document.body.appendChild(link);
        link.click(); // Trigger download
        link.remove(); // Clean up
        window.URL.revokeObjectURL(url); // Revoke the object URL
      } catch (error) {
        console.error('Error downloading certificate:', error);
      }
    };
      
      
    return (
       
        <div className='page-bg'> 
            <div className='position-relative h-100'>
                <div className='vertical-center verify-cert'>
                    <div className='container py-5'>
        <div className='certificate-template position-relative'
        style={{
        //   height: '100vh',
        //   width: '100%',
          position: 'relative',
        }}
      >
        {/* Background Image */}
        <Image
  src="https://certs365-live.s3.amazonaws.com/uploads/Certificate%20of%20Participation%2002.png"
  alt="Background"
        // @ts-ignore: Implicit any for children prop
  fill 
  style={{
    zIndex: -1,
    objectFit: 'cover',
  }}
/>
  
        {/* Candidate Name and Course Name */}
        <div
          style={{
            position: 'absolute',
            top: '37%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Candidate Name */}
          <div
            style={{
              textAlign: 'center',
              color: '#CFA935',
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: '60px',
              letterSpacing: '0.04em',
              textTransform: 'capitalize',
              fontFamily: "'Kanit', sans-serif",
            }}
          >
            {apiData?.Details['name'] || apiData?.Details['Name']}
          </div>
  
          {/* Course Name */}
          <div
            style={{
              textAlign: 'center',
              color: '#0C393D',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'capitalize',
              fontFamily: "'Kanit', sans-serif",
              marginBottom: '10px',
              padding: '0 20px',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '80%',
              margin: '0 auto',
            }}
          >
            {apiData?.Details['title'] || apiData?.Details['Course Name']}
          </div>
  
          {/* QR Code */}
          <div>
          <Image
  src={apiData?.Details['qrUrl'] } // Provide a fallback image if `qrUrl` is undefined
  alt="QR Code"
  width={125}
  height={126}
  style={{ marginTop: '20px' }}
  priority // Optional, use if the QR code should load quickly
/>
          </div>
        </div>
  
        {/* Certification Details */}
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {/* Certification Number */}
            <li
              style={{
                color: '#000000',
                fontSize: '10px',
                lineHeight: '22px',
                letterSpacing: '0.03px',
                fontFamily: "'Kanit', sans-serif",
                display: 'inline-block',
              }}
            >
              Certification No.: {apiData?.Details['tid'] || apiData?.Details['Certificate Number']}
            </li>
  
            <li
              style={{
                color: '#4D4D4D',
                width: '1px',
                margin: '0 5px',
                display: 'inline-block',
              }}
            >
              |
            </li>
  
            {/* Issued On */}
            <li
              style={{
                color: '#000000',
                fontSize: '10px',
                lineHeight: '22px',
                letterSpacing: '0.03px',
                fontFamily: "'Kanit', sans-serif",
                display: 'inline-block',
              }}
            >
              Issued On: {apiData?.Details['endTime'] || apiData?.Details['Grant Date']}
            </li>
          </ul>
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