async function fetchFromAPI(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch from API. Status: ${response.status}`);
  }
  return response.json();
}

function convertToMMDDYYYY(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default async function handler(req, res) {
  const { eid } = req.query;

  if (!eid) {
    return res.status(400).json({ error: "Missing `eid` parameter" });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_EXAM_APIKEY;
    const [resultsData, examData] = await Promise.all([
      fetchFromAPI(`https://exam.proctoring365.io/index.php?option=com_exams&task=api.queryResults&format=raw&code=${apiKey}&eid=${eid}`),
      fetchFromAPI(`https://exam.proctoring365.io/index.php?option=com_exams&task=api.getExams&format=raw&code=${apiKey}&eid=${eid}`)
    ]);
    const [result] = resultsData; // Assume `resultsData` is an array
    const [exam] = examData; // Assume `examData` is an array

    const { startTime, endTime, passed, tid, name } = result;
    result.startTime=convertToMMDDYYYY(startTime)
    result.endTime=convertToMMDDYYYY(endTime)

    let qrUrl = null;

    if (passed) {
      const loginData = await fetchFromAPI(
        `${process.env.NEXT_PUBLIC_BASE_URL_USER}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: process.env.NEXT_PUBLIC_ISSUER_EMAIL,
            password: process.env.NEXT_PUBLIC_ISSUER_PASS,
          }),
        }
      );

      const issuanceResponse = await fetchFromAPI(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/issuance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.data.JWTToken}`,
          },
          body: JSON.stringify({
            email: process.env.NEXT_PUBLIC_ISSUER_EMAIL,
            certificateNumber: tid,
            name,
            course: exam.title,
            grantDate: convertToMMDDYYYY(endTime),
            expirationDate: "1",
            flag: false,
          }),
        }
      );

      qrUrl = issuanceResponse.qrCodeImage;
    }

    res.status(200).json({ ...result, ...exam, qrUrl });
  } catch (error) {
    console.error("Error in proxy API:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
