import api from "./api";

export const getAllUsers = () => {
  return api.get("/api/admin/users");
};

export const updateUserRole = (data) =>
api.put("/api/admin/users/role", data);
