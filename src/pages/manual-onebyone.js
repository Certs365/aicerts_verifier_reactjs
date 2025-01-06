import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Form,
  Modal,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import Button from "../../shared/button/button";
import Image from "next/image";
import { useRouter } from "next/router";
import { ApiDataContext } from "../utils/ContextState";
import axios from "axios";
import Navigation from "@/app/navigation";
import { toast } from "react-toastify";

const ManualOneByOne = () => {
  const { setCertificateData } = useContext(ApiDataContext);
  const [certificateIds, setCertificatedId] = useState([]);
  const [newcertificateIds, setNewcertificateIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedcertificateIds, setEditedcertificateIds] = useState("");
  const router = useRouter();
  const [content, setContent] = useState([]);
  const inputRef = useRef(null);

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

  const handleInput = (e) => {
    const text = e.target.innerText;
    if (text.includes(" ") || e.key === "Enter" ||  e.keyCode === 32) {
      e.preventDefault(); 
  
      const parts = text
        .split(/[\s]+/) 
        .map((part) => part.trim())
        .filter(Boolean); 
  

    // if (text.includes(" ")) {
    //   const parts = text
    //     .split(" ")
    //     .map((part) => part.trim())
    //     .filter(Boolean);

      if (parts.length === 1) {
        setContent([...content, ...parts]);
      } else {
        setContent([...content, ...parts.slice(0, -1)]);
      }
      // Add the last valid input as a card and clear the contenteditable
      // setContent([...content, ...parts.slice(0, -1)]);
      e.target.innerText = "";
    }
  };
  const handleAddRecipient = (event) => {
    event.preventDefault();
    if (newcertificateIds.trim() !== "") {
      const certIds = newcertificateIds
        .split(/[\s,]+/)
        .map((cert) => cert.trim())
        .filter((cert) => cert);

      if (certIds.length > 0) {
        const newRecipients = content.map((cert) => ({
          certificationID: cert,
        }));
        setCertificatedId([...certificateIds, ...newRecipients]);
        setNewcertificateIds("");
      }
    }
    if (content.length > 0) {
      const newRecipientsFromContent = content.map((cert) => ({
        certificationID: cert,
      }));
      setCertificatedId((prev) => [...prev, ...newRecipientsFromContent]);

      // Clear the content array
      setContent([]);
    }
  };

  const removeCard = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedcertificateIds(certificateIds[index]?.certificationID);
  };

  const handleSaveEdit = () => {
    const updatedCertificates = certificateIds.map((item, index) =>
      index === editingIndex
        ? { ...item, certificationID: editedcertificateIds }
        : item
    );
    setCertificatedId(updatedCertificates);
    setEditingIndex(null); // Clear the edit mode
  };

  // const handleAddRecipient = (event) => {
  //   event.preventDefault();

  //   if (newcertificateIds.trim() !== "") {
  //     const certIds = newcertificateIds
  //       .split(/[\s,]+/)  // Split by spaces or commas
  //       .map((cert) => cert.trim())
  //       .filter((cert) => cert);  // Filter out any empty strings

  //     if (certIds.length > 0) {
  //       const newRecipients = certIds.map((cert) => ({
  //         certificationID: cert,
  //       }));
  //       setCertificatedId((prev) => [...prev, ...newRecipients]);
  //       setNewcertificateIds("");  // Clear the input field
  //     }
  //   }

  //   if (content.length > 0) {
  //     const newRecipientsFromContent = content.map((cert) => ({
  //       certificationID: cert,
  //     }));
  //     setCertificatedId((prev) => [...prev, ...newRecipientsFromContent]);

  //     setContent([]);  // Clear the content array
  //   }
  // };

  const handleSubmit = async () => {
    if (!certificateIds || certificateIds.length === 0) {
      toast.error("No certificate IDs are present. Please add them before proceeding.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
      return;
    }
    if (certificateIds.length > 100) {
      toast.error("Maximum limit exceeded! You can only upload up to 100 certificate IDs.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const jsonData = JSON.stringify(certificateIds);

      // Step 2: Create a Blob from JSON data
      const jsonBlob = new Blob([jsonData], { type: "application/json" });

      // Step 3: Create a File object (optional: specify filename)
      const jsonFile = new File([jsonBlob], "data.json", {
        type: "application/json",
      });

      const formData = new FormData();
      formData.append("file", jsonFile);
      formData.append("json", 1);

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
        toast.error("Failed to upload the file. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading the file:", error);
      toast.error("An error occurred during file upload. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    })
    }
  };

  const handleDelete = (index) => {
    const updatedCertificates = certificateIds.filter((_, i) => i !== index);
    setCertificatedId(updatedCertificates);
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

                <Col md={{ span: 10 }} className="mb-4">
                  <Card className="" style={{ border: "1px solid #BFC0C2" }}>
                    <h5
                      className="fw-semibold txt-22"
                      style={{
                        padding: "16px 20px",
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      Add Recipient(s)
                    </h5>
                    <div className="" style={{ padding: "20px" }}>
                      <Form>
                        <Form.Group>
                          <Form.Label>Certificate Number<span style={{color:"GrayText"}}> (Multiple users can we added by separating them with “,”)</span></Form.Label>
                          <div className="d-flex gap-3 flex-column flex-md-row">
                            {/* <Form.Control
                              type="text"
                              value={newcertificateIds}
                              onChange={(e) =>
                                setNewcertificateIds(e.target.value)
                              }
                              
                            /> */}
                            <div
                              style={{
                                border: "1px solid #ccc",
                                padding: "5px",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                flexGrow: 1,
                                // width: "300px",
                              }}
                            >
                              {content.map((item, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "#f0f0f0",
                                    color: "#333",
                                    padding: "5px 10px",
                                    margin: "5px",
                                    borderRadius: "4px",
                                    position: "relative",
                                  }}
                                >
                                  {item}
                                  <span
                                    onClick={() => removeCard(index)}
                                    style={{
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                      color: "gray",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ×
                                  </span>
                                </div>
                              ))}
                             <div
  contentEditable
  ref={inputRef}
  onInput={(e) => {
    // Fallback for handling content changes
    if (e.target.textContent.trim() === "" && content.length > 0) {
      removeCard(content.length - 1);
    }
  }}
  onPaste={(e) => {
    // Prevent image paste
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault(); // Prevent pasting the image
        break;
      }
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Backspace" && e.target.textContent.trim() === "") {
      // Remove the last card if input is empty and Backspace is pressed
      if (content.length > 0) {
        removeCard(content.length - 1);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault(); // Prevent a new line from being added in the editable div
      const newContent = e.target.textContent.trim();
      if (newContent) {
        setContent((prevContent) => [...prevContent, newContent]);
        e.target.textContent = ""; // Clear the editable div
      }
    }
  }}
  style={{
    outline: "none",
    minWidth: "100px",
    flexGrow: 1,
    padding: "5px",
  }}
></div>

                            </div>
                            <button
                              className="txt-12 fw-semibold p-2"
                              style={{
                                backgroundColor: "#CFA935",
                                color: "white",
                                border: "none",
                              }}
                              onClick={handleAddRecipient}
                            >
                              Add receipients
                            </button>
                          </div>
                        </Form.Group>
                      </Form>
                    </div>
                  </Card>
                </Col>
                <Col md={{ span: 10 }}>
                  <Card
                    className="add-recipent"
                    style={{ border: "1px solid #BFC0C2" }}
                  >
                    <h5
                      className="txt-22 fw-semibold"
                      style={{ padding: "16px 20px", color: "#1C1F30" }}
                    >
                      Added Recipients List
                    </h5>
                    <div className="overflow-auto">
                    <Table>
                      <thead>
                        <tr className="" style={{ backgroundColor: "#F3F3F3" }}>
                          <th>S.No.</th>
                          <th style={{ width: "75%" }}>Certificate Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificateIds.length > 0 ? (
                          certificateIds?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}.</td>
                              <td>
                                {" "}
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={editedcertificateIds}
                                    onChange={(e) =>
                                      setEditedcertificateIds(e.target.value)
                                    }
                                    onBlur={handleSaveEdit}
                                    autoFocus
                                  />
                                ) : (
                                  <span>{item.certificationID}</span>
                                )}
                              </td>
                              <td style={{ display: "flex", gap: "8px" }}>
                                <div
                                  className="edit-btn-hover"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEdit(index)}
                                >
                                  <i
                                    class="bx bxs-edit-alt"
                                    style={{ color: "#CFA935" }}
                                  ></i>
                                  <span
                                    className="txt-12 fw-semibold"
                                    style={{ color: "#CFA935" }}
                                  >
                                    Edit
                                  </span>
                                </div>
                                <span className="border-end"></span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  className="delete-btn-hover"
                                  onClick={() => handleDelete(index)}
                                >
                                  <i
                                    class="bx bxs-trash"
                                    style={{ color: "#DB371F" }}
                                  ></i>
                                  <span
                                    className="txt-12 fw-semibold"
                                    style={{ color: "#DB371F" }}
                                  >
                                    Delete
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                        {/* <tr>
                          <td>2.</td>
                          <td>eryuu67899999999ghhj</td>
                          <td style={{ display: "flex", gap: "8px" }}>
                            <div
                              className="edit-btn-hover"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                class="bx bxs-edit-alt"
                                style={{ color: "#CFA935" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#CFA935" }}
                              >
                                Edit
                              </span>
                            </div>
                            <span className="border-end"></span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              className="delete-btn-hover"
                            >
                              <i
                                class="bx bxs-trash"
                                style={{ color: "#DB371F" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#DB371F" }}
                              >
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>3.</td>
                          <td>eryuu67899999999ghhj</td>
                          <td style={{ display: "flex", gap: "8px" }}>
                            <div
                              className="edit-btn-hover"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                class="bx bxs-edit-alt"
                                style={{ color: "#CFA935" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#CFA935" }}
                              >
                                Edit
                              </span>
                            </div>
                            <span className="border-end"></span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              className="delete-btn-hover"
                            >
                              <i
                                class="bx bxs-trash"
                                style={{ color: "#DB371F" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#DB371F" }}
                              >
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>4.</td>
                          <td>eryuu67899999999ghhj</td>
                          <td style={{ display: "flex", gap: "8px" }}>
                            <div
                              className="edit-btn-hover"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <i
                                class="bx bxs-edit-alt"
                                style={{ color: "#CFA935" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#CFA935" }}
                              >
                                Edit
                              </span>
                            </div>
                            <span className="border-end"></span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              className="delete-btn-hover"
                            >
                              <i
                                class="bx bxs-trash"
                                style={{ color: "#DB371F" }}
                              ></i>
                              <span
                                className="txt-12 fw-semibold"
                                style={{ color: "#DB371F" }}
                              >
                                Delete
                              </span>
                            </div>
                          </td>
                        </tr> */}
                      </tbody>
                    </Table>
                    </div>
                  </Card>
                </Col>
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
                  onClick={() => router.push("/upload-spreadsheet")}
                >
                  Switch to Spreadsheet
                </div>
              </Row>

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
      <div className="page-footer-bg"></div>
    </>
  );
};

export default ManualOneByOne;
