
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, "") + "/",
  headers: {
    Accept: "application/json",
  },
});

const testimonialService = {
  getFeed: async (offset = 1, limit = 20) => {
    const response = await api.get("getFeed.json", {
      params: { offset, limit },
    });
    return response.data;
  },

  getFeedById: async (id) => {
    const formData = new FormData();
    formData.append("id", id);

    const response = await api.post("getFeedById.json", formData);
    return response.data;
  },

  addFeed: async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    const response = await api.post("addFeed.json", formData);
    return response.data;
  },

  updateFeed: async (data) => {
    if (!data.id) throw new Error("Feedback ID is required.");

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    const response = await api.post("updateFeed.json", formData);
    return response.data;
  },

  deleteFeed: async (id) => {
    const formData = new FormData();
    formData.append("id", id);

    const response = await api.post("deleteFeed.json", formData);
    return response.data;
  },

  getFeedImageUrl: (imagePath, host) => {
    if (!imagePath) return "/assets/group-schools.png";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const base = (host || IMAGE_BASE_URL).replace(/\/+$/, "");
    return `${base}/${imagePath.replace(/^\/+/, "")}`;
  },
};

export default testimonialService;
