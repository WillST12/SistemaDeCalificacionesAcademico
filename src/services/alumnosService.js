// src/services/alumnosService.js
import api from "./api";

export const alumnosService = {
  
  listar: () => api.get("/alumnos"),

  obtenerPorId: (id) => api.get(`/alumnos/${id}`),

  crear: (data) => api.post("/alumnos", data),

  editar: (id, data) => api.put(`/alumnos/${id}`, data),

  eliminar: (id) => api.delete(`/alumnos/${id}`), // soft delete

};
