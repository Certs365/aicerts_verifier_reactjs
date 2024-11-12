// pages/api/proxy-exam-results.js

export default async function handler(req, res) {
    // Extract `eid` from the query parameters
    const { eid } = req.query;
  
    if (!eid) {
      return res.status(400).json({ error: "Missing `eid` parameter" });
    }
  
    try {
      // Fetch data from the external API
      const response = await fetch(
        `https://exam.proctoring365.io/index.php?option=com_exams&task=api.queryResults&format=raw&code=${process.env.NEXT_PUBLIC_EXAM_APIKEY}&eid=${eid}`,
        {
          method: "GET",
        }
      );
  
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: "Error fetching data from external API" });
      }
  
      // Get the response data as text or JSON based on your needs
      const data = await response.json(); // Or `await response.json()` if JSON response

      const examresp = await fetch(
        `https://exam.proctoring365.io/index.php?option=com_exams&task=api.getExams&format=raw&code=${process.env.NEXT_PUBLIC_EXAM_APIKEY}&eid=${eid}`,
        {
          method: "GET",
        }
      );
  
      if (!examresp.ok) {
        return res
          .status(examresp.status)
          .json({ error: "Error fetching data from external API" });
      }
  
      // Get the response data as text or JSON based on your needs
      const examdata = await examresp.json(); // Or `await response.json()` if JSON response
     
      // Your Unix timestamps (in seconds)
const startTime =data[0].startTime;
const endTime = data[0].endTime;

// Convert Unix timestamp (seconds) to JavaScript Date object
const startDate = new Date(parseInt(startTime) * 1000); // Multiply by 1000 to convert to milliseconds
const endDate = new Date(parseInt(endTime) * 1000); // Multiply by 1000 to convert to milliseconds

// Convert to human-readable date format (e.g., "October 19, 2024 1:45:02 PM")
 data[0].startTime = startDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
 data[0].endTime = endDate.toLocaleString('en-US', {  year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });

 console.log(data[0])

      // Forward the data to the client
      res.status(200).json({...data[0],...examdata[0]});
    } catch (error) {
      console.error("Error in proxy API:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  