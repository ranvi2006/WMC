import api from "./api";

/**
 * Enroll logged-in student into a course
 * @param {string} courseId
 */
export const enrollInCourse = async (courseId) => {
  return api.post("/api/enrollments", { courseId });
};

/**
 * Get logged-in student's enrollments
 */
export const getMyEnrollments = async () => {
  return api.get("/api/enrollments/my");
};

/**
 * (Admin) Get all enrollments for a course
 * @param {string} courseId
 */
export const getCourseEnrollments = async (courseId) => {
  return api.get(`/api/enrollments/course/${courseId}`);
};
