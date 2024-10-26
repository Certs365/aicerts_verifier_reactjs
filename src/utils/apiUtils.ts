// utils/apiUtils.ts
import axios from "axios";

// Maximum retries for API requests
const MAX_RETRIES = 3;

// Timeout for API requests in milliseconds
const REQUEST_TIMEOUT = 5000;

export const apiCallWithRetries = async (url: string, data: object) => {
  let attempts = 0;
  const source = axios.CancelToken.source();

  // Set a timeout for the request
  const timeoutId = setTimeout(() => source.cancel("API request timeout exceeded"), REQUEST_TIMEOUT);

  try {
    while (attempts < MAX_RETRIES) {
      try {
        const response = await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
          cancelToken: source.token,
        });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          throw new Error("API request timed out. Please try again.");
        }
        attempts++;
        if (attempts >= MAX_RETRIES) throw error; // Throw the last error if retries are exhausted
      }
    }
  } finally {
    clearTimeout(timeoutId); // Clear the timeout if the request completes
  }
};
