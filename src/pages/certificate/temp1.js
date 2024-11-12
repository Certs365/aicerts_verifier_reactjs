import React from 'react';
import Image from 'next/legacy/image';

// @ts-ignore
const CertificateTemplateOne = ({apiData}) => {
    console.log(apiData)

    return (
        <div className='container py-5'>
            <div className='certificate-template position-relative' id="template-3">
                <div className='hero-logo m-auto position-relative'>
                    <Image
                    
                        src='/logo-black.svg'
                        layout='fill'
                        objectFit="contain"
                        alt='AI Certs logo'
                    />
                </div>
                <div className='hero-info text-center'>This is to certify that</div>
                <div className='issued-to text-center'>{apiData?.Details['name']}</div>
                <div className='hero-message text-center'>Has successfully Pass the Exam {apiData?.Details['title']}</div>
                <div className='course-name text-center'>With Score {apiData?.Details['score']} out of {apiData?.Details['total_score']} </div>
                <div className='issued-by text-center'>
                    <div className='signature position-relative'>
                        <Image
                            src='/backgrounds/russel-signature.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                    <hr />
                    <div className='issuer-info d-flex justify-content-between align-items-center'>
                        <div className='issuer-name'>Russell Sarder</div>
                        <div className='issuer-designation'>Chairman & CEO, AI Certs<sup>&trade;</sup></div>
                    </div>
                </div>
                <div className='badge-position position-absolute'>
                    <div className='ai-badge-logo'>
                        <Image
                            src='/backgrounds/bitcoin-certified-trainer-badge.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                </div>
                <div className='bottom-info d-flex justify-content-center align-items-center w-100 position-absolute'>
                    <div className='certificate-info'>Certificate No.: {apiData?.Details['tid']}</div> 
                    <span>|</span>
                    <div className='certificate-info'>Exam Start Time: {apiData?.Details['startTime']}</div>
                    <span>|</span>
                    <div className='certificate-info'>Exam End Time: {apiData?.Details['endTime']}</div>
                </div>
            </div>
        </div>
    );
}

export default CertificateTemplateOne;