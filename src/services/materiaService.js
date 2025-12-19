// src/services/materiaService.js
import { api } from "./api";

const materiaService = {
  listar: () => api.get("/Materias"),
  obtener: (id) => api.get(`/Materias/${id}`),
  crear: (data) => api.post("/Materias", data),
  actualizar: (id, data) => api.put(`/Materias/${id}`, data),
  desactivar: (id) => api.put(`/Materias/desactivar/${id}`),
  reactivar: (id) => api.put(`/Materias/reactivar/${id}`),
};

export default materiaService;
