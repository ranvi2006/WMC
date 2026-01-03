import api from "./api";

export const getAvailability = async (teacherId, date) => {
  const res = await api.get(
    `/availability?teacherId=${teacherId}&date=${date}`
  );
  return res.data.availability;
};