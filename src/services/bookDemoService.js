
import axios from "axios";


const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Get available meeting time slots for selected date
export const getMeetingTimingByDate = async (date) => {
    try {
        const response = await Api.post(
            "getMeetingTimingByDate.json",
            { date }
        );

        return response.data;
    } catch (error) {
        console.error("Get Meeting Timings API Error:", error);
        throw error;
    }
};

// Submit demo booking details
export const bookDemo = async (bookingData) => {
    try {
        const response = await Api.post(
            "putMeetingDetails.json",
            bookingData
        );

        return response.data;
    } catch (error) {
        console.error("Book Demo API Error:", error);
        throw error;
    }
};
