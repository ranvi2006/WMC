import api from "./api";

/**
 * Get all published courses (public)
 */
export const getAllCourses = () => {
  return api.get("/api/courses");
};

/**
 * Get single course by ID
 */
export const getCourseById = (id) => {
  return api.get(`/api/courses/${id}`);
};

export const updateCourse = (id, data) =>
  api.put(`/api/courses/${id}`, data);