import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7055/api",
});

// interceptor para el token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});
