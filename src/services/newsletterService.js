
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const newsletterService = {
  // Add newsletter subscriber
  addNewsletterInfo: async (payload) => {
    try {
      const response = await api.post(
        "addNewsletterInfo.json",
        {
          name: payload.name,
          email: payload.email,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Add newsletter subscriber error:",
        error.response?.data || error.message
      );

      throw error;
    }
  },

  // Get all newsletter subscribers
  getNewsletterInfo: async () => {
    try {
      const response = await api.get(
        "getNewsletterInfo.json"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get newsletter subscribers error:",
        error.response?.data || error.message
      );

      throw error;
    }
  },

  // Send newsletter to all subscribers
  sendNewsletter: async (payload) => {
    try {
      const response = await api.post(
        "sendNewsletter.json",
        {
          blog_id: payload.blog_id,
          newslatter_content: payload.newslatter_content,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Send newsletter error:",
        error.response?.data || error.message
      );

      throw error;
    }
  },
};

export default newsletterService;
