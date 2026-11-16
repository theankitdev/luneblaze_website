
import axios from "axios";

const blogApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const blogService = {
  // Get all blogs
  getBlogs: async (offset = 0, limit = 20) => {
    const response = await blogApi.get("getBlogs.json", {
      params: { offset, limit },
    });

    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id) => {
    const response = await blogApi.post("getBlogById.json", {
      id,
    });

    return response.data;
  },

  // Get blog by subtitle
  getBlogByTitle: async (subtitle) => {
    const response = await blogApi.post("getBlogByTitle.json", {
      subtitle,
    });

    return response.data;
  },

  // Add blog
  addBlog: async (formData) => {
    const response = await blogApi.post("addBlog.json", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update blog
  updateBlog: async (formData) => {
    const response = await blogApi.post("updateBlog.json", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await blogApi.post("deleteBlog.json", {
      id,
    });

    return response.data;
  },
};

export default blogService;
