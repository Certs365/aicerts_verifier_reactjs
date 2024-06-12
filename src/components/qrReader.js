import { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/img/qr-frame.svg";

const QrReader = ({ apiData, setApiData }) => {
    // QR States
    const scanner = useRef();
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);
    const [openQr, setOpenQr] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);

    // Result
    const [scannedResult, setScannedResult] = useState(undefined);

    // Success
    const onScanSuccess = (result) => {
        // Print the "result" to browser console.
        console.log(result);
        // Handle success.
        // You can do whatever you want with the scanned result.
        setScannedResult(result?.data);
        setApiData(result?.data);
        if (result.data) {
            console.log("Working");
        }
        // Stop scanner on successful scan
        scanner.current.stop();
    };

    // Fail
    const onScanFail = (err) => {
        // Print the "err" to browser console.
        console.log("Failed", err);
    };

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        if (videoEl.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl.current || undefined,
            });

            if (scannedResult) {
                console.log("Success Scan", scannedResult);
            }

            scanner.current
                .start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        return () => {
            if (scanner.current) {
                scanner.current.stop();
            }
        };
    }, [scannedResult]);

    // If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);

    return (
        <div>
            <div>
                <div className="qr-reader">
                    {/* QR */}
                    <video ref={videoEl}></video>
                    <div ref={qrBoxEl} className="qr-box">
                        <img
                            src={QrFrame}
                            alt="Qr Frame"
                            width={256}
                            height={256}
                            className="qr-frame"
                        />
                    </div>

                    {/* Show Data Result if scan is success */}
                    {scannedResult && (
                        <p
                            style={{
                                position: "relative",
                                top: 0,
                                left: 0,
                                zIndex: 99999,
                                color: "red",
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

export default QrReader;
