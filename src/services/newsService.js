
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "https://api.luneblaze.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const newsService = {
  // 1. Get all news
  getNews: async (offset = 0, limit = 20) => {
    try {
      const response = await api.get("getNews.json", {
        params: { offset, limit },
      });

      return response.data;
    } catch (error) {
      console.error("Get News Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 2. Get news by ID
  getNewsById: async (id) => {
    try {
      const response = await api.post("getNewsById.json", { id });
      return response.data;
    } catch (error) {
      console.error("Get News By ID Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 3. Get news by subtitle
  getNewsByTitle: async (subtitle) => {
    try {
      const response = await api.post("getNewsByTitle.json", {
        subtitle,
      });

      return response.data;
    } catch (error) {
      console.error("Get News By Title Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 4. Add news
  addNews: async (newsData) => {
    try {
      const formData = new FormData();

      formData.append("title", newsData.title);
      formData.append("subtitle", newsData.subtitle);
      formData.append("source", newsData.source);
      formData.append("details", newsData.details);
      formData.append("date", newsData.date);
      formData.append("section", newsData.section);

      if (newsData.sourceImage) {
        formData.append("sourceImage", newsData.sourceImage);
      }

      const response = await api.post("addNews.json", formData);

      return response.data;
    } catch (error) {
      console.error("Add News Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 5. Update news
  updateNews: async (newsData) => {
    try {
      const formData = new FormData();

      formData.append("news_id", newsData.news_id);

      if (newsData.title !== undefined)
        formData.append("title", newsData.title);

      if (newsData.subtitle !== undefined)
        formData.append("subtitle", newsData.subtitle);

      if (newsData.source !== undefined)
        formData.append("source", newsData.source);

      if (newsData.details !== undefined)
        formData.append("details", newsData.details);

      if (newsData.date !== undefined)
        formData.append("date", newsData.date);

      if (newsData.section !== undefined)
        formData.append("section", newsData.section);

      if (newsData.tags !== undefined)
        formData.append("tags", newsData.tags);

      if (newsData.source_img) {
        formData.append("source_img", newsData.source_img);
      }

      const response = await api.post("updateNews.json", formData);

      return response.data;
    } catch (error) {
      console.error("Update News Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 6. Delete news
  deleteNews: async (news_id) => {
    try {
      const response = await api.post("deleteNews.json", {
        news_id,
      });

      return response.data;
    } catch (error) {
      console.error("Delete News Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Generate news image URL
  getNewsImageUrl: (imagePath) => {
    if (!imagePath) return "/assets/group-schools.png";

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    return `${IMAGE_BASE_URL.replace(/\/$/, "")}/${imagePath.replace(
      /^\//,
      ""
    )}`;
  },
};

export default newsService;
