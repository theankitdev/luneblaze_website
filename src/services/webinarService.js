
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/+$/,
  ""
);

if (!API_BASE_URL) {
  console.error(
    "NEXT_PUBLIC_API_BASE_URL is missing. Please configure it in .env.local"
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Common error handler
const handleApiError = (message, error) => {
  console.error(message, error.response?.data || error.message);
  throw error;
};

// Helper for JSON POST requests
const postRequest = async (url, payload, errorMessage) => {
  try {
    const response = await api.post(url, payload);
    return response.data;
  } catch (error) {
    handleApiError(errorMessage, error);
  }
};

// Helper for multipart/form-data requests
const postFormRequest = async (url, payload, errorMessage) => {
  try {
    const formData =
      payload instanceof FormData
        ? payload
        : (() => {
            const form = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                form.append(key, value);
              }
            });

            return form;
          })();

    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(errorMessage, error);
  }
};

// =====================================================
// 1. WEBINAR MANAGEMENT APIs
// =====================================================

// Get all webinars
// Backend: getSession() - GET
const getWebinars = async ({ offset = 1, limit = 20 } = {}) => {
  try {
    const response = await api.get("/getSession.json", {
      params: { offset, limit },
    });

    return response.data;
  } catch (error) {
    handleApiError("Get webinars API error:", error);
  }
};

// Get webinar details by ID
// Backend: getSessionById() - POST
const getWebinarById = async (payload) => {
  const id =
    typeof payload === "object" && payload !== null
      ? payload.id
      : payload;

  if (!id) throw new Error("Webinar ID is required.");

  return postRequest(
    "/getSessionById.json",
    { id },
    "Get webinar by ID API error:"
  );
};

// Get webinar by subtitle / slug
// Backend: getSessionBySubtitle() - POST
const getWebinarBySubtitle = async ({ subtitle }) => {
  return postRequest(
    "/getSessionBySubtitle.json",
    { subtitle },
    "Get webinar by subtitle API error:"
  );
};

// Add webinar
// Backend: addSession() - POST multipart/form-data
const addWebinar = async (payload) => {
  return postFormRequest(
    "/addSession.json",
    payload,
    "Add webinar API error:"
  );
};

// Update webinar
// Backend: updateSession() - POST multipart/form-data
const updateWebinar = async (payload) => {
  return postFormRequest(
    "/updateSession.json",
    payload,
    "Update webinar API error:"
  );
};

// Delete webinar
// Backend: deleteSession() - POST
const deleteWebinar = async ({ id }) => {
  return postRequest(
    "/deleteSession.json",
    { id },
    "Delete webinar API error:"
  );
};

// =====================================================
// 2. WEBINAR REGISTRATION APIs
// =====================================================

// Register user after successful Razorpay payment
// Backend: webinarRegistration() - POST
const registerWebinar = async (payload) => {
  return postRequest(
    "/webinarRegistration.json",
    payload,
    "Webinar registration API error:"
  );
};

// Get all registrations for a webinar
// Backend: getwebinarRegistrationByWebinarId() - POST
const getWebinarRegistrations = async ({ id }) => {
  return postRequest(
    "/getwebinarRegistrationByWebinarId.json",
    { id },
    "Get webinar registrations API error:"
  );
};

// Manually add webinar registration
// Backend: putWebinarRegistration() - POST
const addManualRegistration = async (payload) => {
  return postRequest(
    "/putWebinarRegistration.json",
    payload,
    "Add manual registration API error:"
  );
};

// Update webinar registration
// Backend: updateWebinarRegistration() - POST
const updateWebinarRegistration = async (payload) => {
  return postRequest(
    "/updateWebinarRegistration.json",
    payload,
    "Update webinar registration API error:"
  );
};

// =====================================================
// 3. WEBINAR JOINING & INVITATION APIs
// =====================================================

// Check whether user is registered before joining
// Backend: joinLiveWebinar() - POST
const joinLiveWebinar = async ({ webinar_id, email }) => {
  return postRequest(
    "/joinLiveWebinar.json",
    { webinar_id, email },
    "Join live webinar API error:"
  );
};

// Send webinar invitations to registered users
// Backend: sendWebinarInvites() - POST
const sendWebinarInvites = async ({ webinarId }) => {
  return postRequest(
    "/sendWebinarInvites.json",
    { webinarId },
    "Send webinar invites API error:"
  );
};

// =====================================================
// 4. CERTIFICATE APIs
// =====================================================

// Generate and send certificates to all registered users
// Backend: sendCertificates() - POST
const sendCertificates = async ({ webinarId }) => {
  return postRequest(
    "/sendCertificates.json",
    { webinarId },
    "Send certificates API error:"
  );
};

// Get certificate sending progress
// Backend: getCertificateProgress()
const getCertificateProgress = async () => {
  try {
    const response = await api.get("/getCertificateProgress.json");
    return response.data;
  } catch (error) {
    handleApiError("Get certificate progress API error:", error);
  }
};

// Generate and send certificate for an individual registration
// Backend: sendCertificate() - POST
const sendCertificate = async ({ userId }) => {
  return postRequest(
    "/sendCertificate.json",
    { userId },
    "Send individual certificate API error:"
  );
};

// Generate certificate using registered email and webinar ID
// Backend: generateCertificate() - POST
const generateCertificate = async ({ email, webinar_id }) => {
  const response = await api.post(
    "/generateCertificate",
    { email, webinar_id },
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );

  return response;
};

// =====================================================
// EXPORT ALL WEBINAR SERVICES
// =====================================================

const webinarService = {
  // Webinar management
  getWebinars,
  getWebinarById,
  getWebinarBySubtitle,
  addWebinar,
  updateWebinar,
  deleteWebinar,

  // Registration
  registerWebinar,
  getWebinarRegistrations,
  addManualRegistration,
  updateWebinarRegistration,

  // Joining and invitations
  joinLiveWebinar,
  sendWebinarInvites,

  // Certificates
  sendCertificates,
  getCertificateProgress,
  sendCertificate,
  generateCertificate,
};

export default webinarService;
