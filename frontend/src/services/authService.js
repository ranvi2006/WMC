import api from "./api";

export const loginUser = (payload) =>
  api.post("/api/auth/login", payload);

export const registerUser = (payload) =>
  api.post("/api/auth/register", payload);
