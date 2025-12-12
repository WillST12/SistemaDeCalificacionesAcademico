// src/services/dashboardService.js
import { api } from "./api";

const dashboardService = {
  admin: () => api.get("/Dashboard/admin"),
  profesor: (idUsuario) => api.get(`/Dashboard/profesor/${idUsuario}`),
  alumno: (idUsuario) => api.get(`/Dashboard/alumno/${idUsuario}`)
};

export default dashboardService;
