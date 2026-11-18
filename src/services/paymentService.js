
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

const paymentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Common API error handler
const handleApiError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Payment request failed. Please try again.";

  console.error("Payment API Error:", message);
  throw new Error(message);
};

const paymentService = {
  // 1. Create Razorpay order
  createRazorpayOrder: async ({ amount }) => {
    try {
      if (!amount || Number(amount) < 1) {
        throw new Error("Valid payment amount is required.");
      }

      const response = await paymentApi.post(
        "/rayzorPayHandler.json",
        {
          amount: Number(amount),
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // 2. Verify Razorpay payment and complete webinar registration
  verifyWebinarPayment: async ({
    webinarId,
    webinarTitle,
    email,
    name,
    school,
    contact,
    designation,
    referralSource,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
  }) => {
    try {
      const requiredFields = {
        webinarId,
        webinarTitle,
        email,
        name,
        school,
        contact,
        designation,
        referralSource,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([, value]) => value === undefined || value === null || value === "")
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw new Error(
          `Missing required payment details: ${missingFields.join(", ")}`
        );
      }

      const response = await paymentApi.post(
        "/webinarRegistration.json",
        {
          webinarId,
          webinarTitle,
          email,
          name,
          school,
          contact,
          designation,
          referralSource,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default paymentService;
