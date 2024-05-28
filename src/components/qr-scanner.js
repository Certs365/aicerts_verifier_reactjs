// @ts-nocheck
import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { Button } from 'react-bootstrap';

const QRScan = () => {
    const [selected, setSelected] = useState("certification verification");
    const [startScan, setStartScan] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);
    const [data, setData] = useState("");

    // useEffect to set the data when startScan changes to "Stop scan"
    useEffect(() => {
        if (startScan != false) {
            // Perform any data retrieval or processing here
            // For example, fetching data from an API or setting some default value
            setData('');
        }
    }, [startScan]);

    const handleScan = async (scanData) => {
        setLoadingScan(true);
        if (scanData && scanData.text && scanData.text.startsWith("https://tinyurl.com")) {
            console.log(`Navigating to: ${scanData.text}`);
            window.location.href = scanData.text;
        } else {
            if (scanData && scanData.text !== "") {
                console.log(`loaded >>>`, scanData.text);
                setData(scanData.text);
                // setData("Invalid Certification");
                setStartScan(false);
                setLoadingScan(false);
            }
        }
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <select onChange={(e) => setSelected(e.target.value)}>
                            <option value={"environment"}>Back Camera</option>
                            <option value={"user"}>Front Camera</option>
                        </select>
                        <QrReader
                            facingMode={selected}
                            delay={500}
                            onError={handleError}
                            onScan={handleScan}
                            // chooseDeviceId={()=>selected}
                            style={{ width: "600px", height: "400px" }} // Adjust dimensions accordingly
                        />
                    </div>
                </>
            )}
            {loadingScan && <p>Loading</p>}
            {data !== "" && <p>{data}</p>}
            </div>
        </div>

    );
};

export default QRScan;