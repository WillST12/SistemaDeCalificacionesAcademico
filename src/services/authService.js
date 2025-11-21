import { api } from "./axiosConfig";

export const authService = {
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  cambiarContrasena: async (data) => {
    const response = await api.post("/auth/cambiar-contrasena", data);
    return response.data;
  }
};
