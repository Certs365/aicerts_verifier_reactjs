// @ts-nocheck
import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { Button } from 'react-bootstrap';

const QRScan = (apiData, setApiData) => {
    const [selected, setSelected] = useState("certification verification");
    const [startScan, setStartScan] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);
    const [data, setData] = useState("");
    // const [apiData, setApiData] = useState([]);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // useEffect to set the data when startScan changes to "Stop scan"
    useEffect(() => {
        if (startScan != false) {
            // Perform any data retrieval or processing here
            // For example, fetching data from an API or setting some default value
            setData('');
        }
        console.log("The data", data);
    }, [startScan]);

    const handleScan = async (scanData) => {
        setLoadingScan(true);
        let scanFailed = true; // Flag to track if the scan failed
        var scanResponse = "No URL found";

        // Start a timer for 10 seconds
        // const timeout = setTimeout(() => {
        //     if (scanFailed) {
        //         // If the scan failed after 10 seconds, pass the custom URL to the API
        //         scanResponse = "Unable to detect QR, Try again with different Verification method";
        //         setLoadingScan(false);
        //         setData(scanResponse);
        //         setStartScan(false);
        //     }
        // }, 10000); // 10 seconds in milliseconds

        if (scanData) {
            try {
                // First API call with QR Scanned data
                const qrScanResponse = await fetch(`${apiUrl}/api/decode-qr-scan`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        receivedCode: scanData.text,
                    }),
                });

                console.log(`QR data: ${scanData.text}`);
                scanResponse = scanData ? scanData.text : scanResponse;
                if (qrScanResponse.ok) { // Check if response is successful
                    const responseData = await qrScanResponse.json(); // Parse response body as JSON
                    console.log("The response", responseData.data); // Do something with the response data
                    // setApiData(responseData.data);
                    scanFailed = false;
                    // clearTimeout(timeout); // Clear the timeout if the API call succeeds before the 10-second timeout
                } else {
                    console.error('Error:', qrScanResponse.statusText); // Log error message
                    scanFailed = true; // Set flag to true if the scan failed
                }

                setData(scanResponse);
                setStartScan(false);
            } catch (error) {
                console.error("Error during API call:", error);
                scanFailed = true; // Set flag to true if the scan failed
            }
        }
        setLoadingScan(false);
    };

    const handleError = (err) => {
        console.error(err);
    };
    return (
        <div>
            <h2>Certs 365 QR Scanner</h2>
            <Button
                onClick={() => {
                    setStartScan(!startScan);
                }} className='heading-info golden-upload'
                variant="primary"
            >
                {startScan ? "Stop Scan" : "Start Scan"}
            </Button>
            <div>
                {startScan && (
                    <>
                        <div className="qr-dropdown" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <select
                                style={{
                                    backgroundColor: '#c7a95a',
                                    color: '#000000',
                                    fontSize: '16px',
                                    padding: '15px',
                                    margin: '5px',
                                    borderRadius: '4px',
                                    border: '1px solid #000',
                                }}
                                onChange={(e) => setSelected(e.target.value)}>
                                <option
                                    value={"environment"}>Back Camera
                                </option>
                                <option
                                    value={"user"}>Front Camera
                                </option>
                            </select>
                            <div>
                                <QrReader
                                    facingMode={selected}
                                    delay={500}
                                    onError={handleError}
                                    onScan={handleScan}
                                    // chooseDeviceId={()=>selected}
                                    style={{ width: "600px", height: "400px" }} // Adjust dimensions accordingly
                                />
                            </div>
                            {/* <div style={{ position: "absolute", top: "125%", left: "50%", transform: "translate(-50%, -50%)", border: "2px solid red", width: "60%", height: "100%", pointerEvents: "none" }}></div> */}
                        </div>
                    </>
                )}
                {loadingScan && <p>Loading</p>}
                <div><h4>Response: {data}</h4></div>
            </div>
        </div>

    );
};

export default QRScan;