import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7055/api", // Ajusta si es otro puerto
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
