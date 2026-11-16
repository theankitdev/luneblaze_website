
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const logoService = {
  // Get all logos
  getAllLogos: async (offset = 1, limit = 20) => {
    const response = await api.get("getAllLogos.json", {
      params: { offset, limit },
    });
    return response.data;
  },

  // Add logo
  addLogo: async ({ logo_name, logo, logo_type }) => {
    const formData = new FormData();
    formData.append("logo_name", logo_name);
    formData.append("logo", logo);
    formData.append("logo_type", String(logo_type));

    const response = await api.post("addLogo.json", formData);
    return response.data;
  },

  // Update logo (backend action name: updateLoggo)
  updateLogo: async ({ logo_id, logo_name, logo_type, logo }) => {
    const formData = new FormData();

    formData.append("logo_id", String(logo_id));
    formData.append("logo_name", logo_name);
    formData.append("logo_type", String(logo_type));

    if (logo && typeof File !== "undefined" && logo instanceof File) {
      formData.append("logo", logo);
    }

    const response = await api.post("updateLoggo.json", formData);
    return response.data;
  },

  // Delete logo
  deleteLogo: async (logo_id) => {
    const response = await api.post("deleteLogo.json", {
      logo_id,
    });
    return response.data;
  },

  // Generate logo image URL
  getLogoUrl: (logoUri, host) => {
    if (!logoUri) return "";

    const value = String(logoUri).trim();

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const baseUrl =
      host ||
      process.env.NEXT_PUBLIC_IMAGE_URL ||
      "https://api.luneblaze.com/";

    return `${baseUrl.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
  },
};

export default logoService;
