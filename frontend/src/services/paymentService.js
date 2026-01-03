import api from "./api";

export const createPayment = async () => {
  const res = await api.post("/payments/create", {});
  return res.data.paymentId;
};
