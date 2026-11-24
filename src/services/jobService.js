
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const jobApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

// 1. Get all active jobs
export const getJobs = async () => {
    try {
        const response = await jobApi.get("getJobs.json");
        return response.data.data || [];
    } catch (error) {
        console.error("Get Jobs Error:", error.response?.data || error.message);
        throw error;
    }
};

// 2. Get job details by slug
export const getJobBySlug = async (slug) => {
    try {
        if (!slug) {
            throw new Error("Job slug is required");
        }

        const response = await jobApi.get(
            `getJobBySlug/${encodeURIComponent(slug)}.json`
        );

        return response.data.data;
    } catch (error) {
        console.error(
            "Get Job Details Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// 3. Submit job application
// Accepts FormData directly so the resume File is preserved.
export const submitJobApplication = async (applicationData) => {
    try {
        let formData;

        if (applicationData instanceof FormData) {
            formData = applicationData;
        } else {
            formData = new FormData();

            Object.entries(applicationData || {}).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                    formData.append(key, value);
                }
            });
        }

        const response = await jobApi.post(
            "submitJobApplication.json",
            formData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Submit Job Application Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// 4. Get all job applications (Admin)
export const getJobApplications = async (filters = {}) => {
    try {
        const response = await jobApi.get("getJobApplications.json", {
            params: {
                status: filters.status || undefined,
                search: filters.search || undefined,
            },
        });

        return response.data.data || [];
    } catch (error) {
        console.error(
            "Get Job Applications Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// 5. Update job application status (Admin)
export const updateJobApplicationStatus = async (id, status) => {
    try {
        if (!id || !status) {
            throw new Error("Application ID and status are required.");
        }

        const response = await jobApi.post(
            "updateJobApplicationStatus.json",
            {
                id,
                status,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Update Application Status Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// 6. Get resume download URL
// Requires the authenticated CakePHP download endpoint.
export const getJobApplicationResumeUrl = (id) => {
    if (!id) {
        throw new Error("Application ID is required.");
    }

    return `${API_BASE_URL}downloadJobApplicationResume.json?id=${encodeURIComponent(id)}`;
};

export default jobApi;
