
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// GET ALL TEACHERS
export const getAllTeachers = async (offset = 1, limit = 100) => {
  const response = await API.get("/getAllTeachers", {
    params: { offset, limit },
  });
  return response.data;
};

// GET TEACHER BY ID
export const getTeacherById = async (id) => {
  const response = await API.post("/getTeacherById", { id });
  return response.data;
};

// ADD TEACHER
export const addTeacher = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(
        key,
        value instanceof File ? value : 
          typeof value === "object" ? JSON.stringify(value) : value
      );
    }
  });

  const response = await API.post("/addTeacher", formData);
  return response.data;
};

// UPDATE TEACHER
export const updateTeacher = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(
        key,
        value instanceof File ? value :
          typeof value === "object" ? JSON.stringify(value) : value
      );
    }
  });

  const response = await API.post("/updateTeacher", formData);
  return response.data;
};

// DELETE TEACHER
export const deleteTeacher = async (teacher_id) => {
  const response = await API.post("/deleteTeacher", {
    teacher_id,
  });
  return response.data;
};
