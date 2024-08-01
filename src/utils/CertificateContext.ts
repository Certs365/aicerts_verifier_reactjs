import { createContext } from "react";

const CertificateContext = createContext({
  metaDetails: {
    Details: {
      'Course Name': "",
      certificateUrl: "",
      url: ""
    },
    details: {
      'Course Name': "",
      certificateUrl: "",
      url: ""
    },
    message: ""
  },
  setMetaDetails: (metaDetails: any) => {}
});

export default CertificateContext;
