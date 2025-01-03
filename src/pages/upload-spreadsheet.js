import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Form, Modal, ProgressBar, Row } from "react-bootstrap";
import Button from "../../shared/button/button";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { ApiDataContext } from "../utils/ContextState";
import Navigation from "@/app/navigation";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const UploadSpreadsheet = () => {
  const { setCertificateData } = useContext(ApiDataContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      // Simulate progress with a timer only in the UI (not ideal)
      const interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress < 100 ? prevProgress + 5 : 100
        );
      }, 500);

      // Clean up the interval when the component unmounts or loading is complete
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);
  const handleDownload = () => {
    const filePath = "/sampleExcel/validationSample.xlsx";
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "sample.xlsx";
    link.click();
  };
  // Specify the file name for download link.click();
  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileExtension = file?.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!file) {
      toast.error("No file selected. Please choose a file.")
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" }); // Read the file
  
      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName]; // Define worksheet
  
      // Convert worksheet to JSON
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Remove rows with only empty cells
    jsonData = jsonData.filter(
      (row) => row.some((cell) => cell !== undefined && cell !== null && cell !== "")
    );
      // Check for row limit
      if (jsonData.length > 1000) {
        toast.error("File contains more than 1000 rows. Max limit is 1000.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    };
  
    reader.readAsArrayBuffer(file);

    if (!validExtensions.includes(fileExtension)) {

      toast.error("Only CSV, XLSX, and XLS files are supported. Please select a valid file.")
      setSelectedFile(null); // Clear the selected file
      return;
    }


    if (file && file.size > maxSize) {
      toast.error("File size exceeds 2MB limit. Please select a smaller file.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    })
      setSelectedFile(null); // Clear the selected file
    } else {
      // File size is within the limit, proceed with the upload
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!selectedFile) {
      toast.error( "No valid file selected. Please upload a valid CSV, XLSX, or XLS file within the size limit.")
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_BASE_URL}/api/verify-batch`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setCertificateData(response?.data);
        router.push("/uploaded-batch-verification");
      } else {
        toast.error( "Failed to upload the file. Please try again.")
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading the file:", error);
      toast.error( "An error occurred during file upload. Please try again.")
    }
  };

  return (
    <>
      <Navigation />
      <div className="page-bg" style={{ paddingTop: "70px" }}>
        <div className="position-relative">
          <div className="vertical-center verify-cert">
            <div className="container-fluid">
              {/* <Button className='back-btn' label='Back' /> */}
              <Row className="justify-content-center mt-4 verify-documents">
              <div className="d-flex justify-content-between align-items-center col-md-10 mb-3 flex-wrap gap-3">
                  <h1 className="title mb-0 text-center">Batch Verification</h1>
                  <div
                    className="d-flex p-1"
                    style={{ border: "2px solid #BFC0C2", background: "white" }}
                  >
                    <Button
                      className={`white rounded-0`}
                      label="Single Verification"
                      onClick={() => router.push("/verify-documents")}
                    />
                    <Button
                      className={`golden rounded-0`}
                      label="Batch Verification"
                    />
                  </div>
                </div>

                <Col md={{ span: 10 }}>
                  <Card
                    className="p-4 align-items-center justify-content-center"
                    style={{ height: "70vh" }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <div>
                        <Image
                          src="/backgrounds/upload-spreadsheet.svg"
                          width={120}
                          height={120}
                          // layout="fill"
                          // objectFit="contain"
                          alt="Badge banner"
                        />
                      </div>
                      <h5 className="text-center cert-label">
                        Upload spreadsheet with recipent&apos;s data
                      </h5>
                      <Form>
                        <div className="d-flex flex-column align-items-center ">
                          {selectedFile ? (
                            // @ts-ignore: Implicit any for children prop
                            <p className="selected-file-name mt-4 text-center">
                              {selectedFile.name}
                            </p>
                          ) : (
                            <p className="selected-file-name">&nbsp;</p>
                          )}
                          <label
                            htmlFor="fileInput"
                            className="golden-upload mt-0"
                          >
                            Browse File
                          </label>

                          <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept=".csv, .xlsx, .xls"
                          />
                        </div>
                        <div
                          style={{ color: "#CFA935", cursor: "pointer" }}
                          className="txt-14 fw-semibold mt-4 mb-4"
                          onClick={() => handleDownload()}
                        >
                          {/* <a
                            href="/sampleExcel/validationSample.xlsx"
                            download="validationSample.xlsx"
                            style={{ textDecoration: "none", color: "inherit" }}
                          ></a> */}
                          <i class="bx bx-download me-2"></i>
                          Download Spreadsheet Template
                        </div>
                        <div className="information text-center mt-2">
                          Only <strong>CSV, XLSX & XLX </strong> files are
                          supported. <br /> (Upto 2 MB)
                        </div>
                      </Form>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div className="d-flex justify-content-center mt-4 gap-4">
                <Button
                  className={`white rounded-0 border `}
                  label="Cancel"
                  onClick={() => router.push("/batch-verification")}
                />
                <Button
                  className={`golden rounded-0`}
                  label="Submit"
                  onClick={handleSubmit}
                />
              </div>
              <div
                style={{ color: "#CFA935", cursor: "pointer" }}
                className="txt-14 fw-semibold mt-4 mb-4 d-flex justify-content-center"
                onClick={() => router.push("/manual-onebyone")}
              >
                Switch to Manual
              </div>

              <Modal className="loader-modal" show={loading} centered>
                <Modal.Body>
                  <div className="certificate-loader">
                    <Image
                      src="/backgrounds/verification.gif"
                      layout="fill"
                      objectFit="contain"
                      alt="Loader"
                    />
                  </div>
                  <div className="text">Batch Verification In Progress</div>
                  <ProgressBar now={progress} label={`${progress}%`} />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="page-footer-bg mb-4"></div>
    </>
  );
};

export default UploadSpreadsheet;
