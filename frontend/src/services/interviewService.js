import api from "./api";

export const bookInterview = async (data) => {
  return api.post("/interviews/book", data);
};

export const getMyInterviews = async () => {
  return api.get("/interviews/my");
};

export const cancelInterview = async (id) => {
  return api.delete(`/interviews/${id}/cancel`);
};

export const updateInterviewStatus = async (id, status) => {
  return api.patch(`/interviews/${id}/status`, { status });
};
