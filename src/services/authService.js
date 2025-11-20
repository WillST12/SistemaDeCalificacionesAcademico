import { api } from "./axiosConfig";

export const authService = {
  login: (data) => api.post("/auth/login", data),
};
