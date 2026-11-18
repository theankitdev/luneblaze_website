
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const certificateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Handle API errors, including JSON errors returned as Blob
const handleApiError = async (error) => {
  let message = "Something went wrong. Please try again.";

  if (error.response?.data instanceof Blob) {
    try {
      const responseText = await error.response.data.text();
      const parsed = JSON.parse(responseText);

      message = parsed.message || parsed.error || message;
    } catch {
      message = "Unable to process the server response.";
    }
  } else {
    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      message;
  }

  console.error("Certificate API Error:", message);
  throw new Error(message);
};

const certificateService = {
  // 1. Generate and download an individual certificate PDF
  generateCertificate: async ({ email, webinar_id }) => {
    try {
      if (!email || !webinar_id) {
        throw new Error("Email and webinar ID are required.");
      }

      const response = await certificateApi.post(
        "/generateCertificate.json",
        {
          email,
          webinar_id,
        },
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf, application/json",
          },
        }
      );

      // Check whether the server returned an error as a Blob
      if (response.data instanceof Blob &&
          response.data.type.includes("application/json")) {
        const responseText = await response.data.text();
        const parsed = JSON.parse(responseText);

        throw new Error(
          parsed.message || parsed.error || "Certificate generation failed."
        );
      }

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 2. Send certificates to all eligible webinar participants
  sendCertificates: async ({ webinarId }) => {
    try {
      if (!webinarId) {
        throw new Error("Webinar ID is required.");
      }

      const response = await certificateApi.post(
        "/sendCertificates.json",
        { webinarId },
        { timeout: 0 }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 3. Get certificate sending progress
  getCertificateProgress: async () => {
    try {
      const response = await certificateApi.get(
        "/getCertificateProgress.json"
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 4. Send certificate to an individual registered user
  sendCertificate: async ({ userId }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required.");
      }

      const response = await certificateApi.post(
        "/sendCertificate.json",
        { userId }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default certificateService;
