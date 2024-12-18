import React, { useState } from "react";
import { Card, Col, Form, Modal, Row } from "react-bootstrap";
import Button from "../../shared/button/button";
import Image from "next/image";
import { useRouter } from "next/router";
import Navigation from "@/app/navigation";

const BatchVerification = () => {
  const [uploadType, setUploadType] = useState("");
  const [hasRights, setHasRights] = useState(false);
  const router = useRouter();
  const handleUploadTypeChange = (type) => {
    setUploadType(type);
  };

  const handleSelect = () => {
    if (uploadType === "manual") {
      router.push("/manual-onebyone");
    } else {
      router.push("/upload-spreadsheet");
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
                    <div>
                      <h5 className="text-center cert-label mb-3">
                        How would you like to add the recipients?
                      </h5>
                      <div className="d-flex justify-content-center gap-2 flex-column flex-md-row">
                        <div className="border m-2 p-2 text-center d-flex align-items-center justify-content-center pt-5">
                          <Form.Group>
                            <Image
                              src="/backgrounds/manual.png"
                              width={80}
                              height={80}
                              // layout="fill"
                              // objectFit="contain"
                              alt="Badge banner"
                            />
                            <div className="mt-4 m-2">
                              <Form.Check
                                type="checkbox"
                                label="Manually, one by one"
                                id="manual"
                                checked={uploadType === "manual"}
                                onChange={() =>
                                  handleUploadTypeChange("manual")
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                        <div className="border m-2 p-2 text-center d-flex align-items-center justify-content-center pt-5">
                          <Form.Group>
                            <Image
                              src="/backgrounds/spreadsheet.svg"
                              width={80}
                              height={80}
                              // layout="fill"
                              // objectFit="contain"
                              alt="Badge banner"
                            />
                            <div className="mt-4 m-2">
                              <Form.Check
                                type="checkbox"
                                label="Spreadsheet upload"
                                id="spreadsheet"
                                checked={uploadType === "spreadsheet"}
                                onChange={() =>
                                  handleUploadTypeChange("spreadsheet")
                                }
                              />
                            </div>
                          </Form.Group>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <Form.Check
                          type="checkbox"
                          label="I have rights to use the personal data of these recipents."
                          id="rights"
                          checked={hasRights}
                          onChange={(e) => setHasRights(e.target.checked)}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div className="d-flex justify-content-center mt-4 gap-4">
                {/* {!selectedFile ? ( */}
                <Button
                  className={`white rounded-0 border `}
                  label="Cancel"
                  onClick={() => router.push("/verify-documents")}
                />
                {hasRights && uploadType ? (
                  <Button
                    className={`golden rounded-0`}
                    label="Select"
                    onClick={() => handleSelect()}
                  />
                ) : (
                  <Button
                    className={`golden rounded-0`}
                    label="Select"
                    disabled
                  />
                )}
                {/* <Button
                  className={`golden rounded-0`}
                  label="Select"
                  onClick={() => handleSelect()}
                /> */}
                {/* ) : (
              <Button
                className={`golden rounded-0`}
                label="Submit"
                onClick={handleSubmit}
              />
            )} */}
              </div>

              <Modal className="loader-modal" centered>
                <Modal.Body>
                  <div className="certificate-loader">
                    {/* <Image
                  src="/backgrounds/verification.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="Loader"
                /> */}
                  </div>
                  <div className="text">Verification In Progress</div>
                  {/* <ProgressBar now={progress} label={`${progress}%`} /> */}
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="page-footer-bg"></div>
    </>
  );
};

export default BatchVerification;
