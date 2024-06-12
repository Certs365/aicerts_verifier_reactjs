import { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';

const QrReaders = ({ apiData, setApiData }) => {
  const scannerRef = useRef(null);
  const videoElRef = useRef(null);
  const qrBoxElRef = useRef(null);

  const [qrOn, setQrOn] = useState(true);
  const [scannedResult, setScannedResult] = useState(undefined);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setLoginError(''); // Reset error state on close
    setLoginSuccess(''); // Reset success state on close
  };

  useEffect(() => {
    if (videoElRef.current && !scannerRef.current) {
      scannerRef.current = new window.QrScanner(
        videoElRef.current,
        (result) => {
          setScannedResult(result?.data);
          setApiData(result?.data);
          scannerRef.current.stop(); // Stop scanner on successful scan
        },
        {
          onDecodeError: (err) => console.error('Scan failed:', err),
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxElRef.current || undefined,
        }
      );

      // Handle successful scan result if already scanned
      if (scannedResult) {
        console.log('Success Scan:', scannedResult);
      }

      scannerRef.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
          console.error('Scanner start error:', err);
        });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, [scannedResult]);

  useEffect(() => {
    if (!qrOn) {
      alert(
        'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.'
      );
    }
  }, [qrOn]);

  // Handle login success/error logic here (assuming external API calls)
  // ...

  return (
    <div>
      <div>
        <div className="qr-reader">
          {/* QR */}
          <video ref={videoElRef}></video>
          <div ref={qrBoxElRef} className="qr-box">
            <img
              src={QrFrame} // Replace with your QR frame image path
              alt="Qr Frame"
              width={256}
              height={256}
              className="qr-frame"
            />
          </div>

          {/* Show Data Result if scan is successful */}
          {scannedResult && (
            <p
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                zIndex: 99999,
                color: 'red',
              }}
            >
              Scanned Result: {scannedResult}
            </p>
          )}
        </div>
      </div>
      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>
                    {loginError !== '' ? (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{loginError}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    ) : (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
                            <button className='success' onClick={handleClose}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default QrReaders;
