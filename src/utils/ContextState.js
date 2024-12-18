import React, { createContext, useState } from 'react';

// Create a Context
// @ts-ignore: Implicit any for children prop
export const ApiDataContext = createContext();

// Create a provider component
// @ts-ignore: Implicit any for children prop
export const ApiDataProvider = ({ children }) => {
  const [apiData, setApiData] = useState({
    Details: {
      "Certificate Number": null,
      "Name": null,
      "Course Name": null,
      "Grant Date": null,
      "Expiration Date": null,
      "Polygon URL": null,
      "url": null,
      "certificateUrl": null
    },
    message: null,
  });

  const [certificateData, setCertificateData] = useState([]);
  

  return (
    <ApiDataContext.Provider value={{ apiData, setApiData, certificateData, setCertificateData }}>
      {children}
    </ApiDataContext.Provider>
  );
};
