import { useContext, useEffect, useRef, useState } from "react";
// Qr Scanner
import "../app/QrStyles.css"
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/img/qr-frame.svg";
import Image from "next/image";
import { useRouter } from 'next/router';
import axios from "axios";
import { ApiDataContext } from "@/utils/ContextState";
import { apiCallWithRetries } from "@/utils/apiUtils";
import { Modal, ProgressBar } from "react-bootstrap";

//@ts-ignore
const QrReader = () => {
  // QR StatesDetails
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const [selected, setSelected] = useState("certification verification");
    const [startScan, setStartScan] = useState(true);
    const [loadingScan, setLoadingScan] = useState(false);
    const [data, setData] = useState("");
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);
    const { apiData, setApiData } = useContext(ApiDataContext);
    const [hasScanned, setHasScanned] = useState<boolean>(false); // Flag to track scanning state

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Success
  const onScanSuccess = async (result: QrScanner.ScanResult) => {
    if (loading) return;  // Prevent additional scans during loading
    setLoading(true);  // Start loading

    try {
      setScannedResult(result.data);
      const scannedUrl = result.data;

      if (scannedUrl) {
        const qrScanResponse = await apiCallWithRetries(`${apiUrl}/api/decode-qr-scan`, { receivedCode: scannedUrl });
        
        if (qrScanResponse.status === "SUCCESS") {
          setApiData({
            Details: qrScanResponse?.Details || qrScanResponse?.details,
            message: qrScanResponse?.message,
          });
          setLoading(false);  // Stop loading after success
        }
      }
    } catch (error: any) {
      setLoading(false);  // Stop loading on error

      if (error.response.data.message === 'Certification has revoked' || error.response.data.message === "Credential has revoked") {
        router.push('/certificate-revoked');
      } else {
        router.push('/invalid-certificate');
      }
    }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    // console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err: any) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <>
    <div className="qr-reader" >
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <Image
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
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
    <Modal className='loader-modal' show={loading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/certification-loader.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                </Modal.Body>
            </Modal>
    </>
  );
};

export default QrReader;
