// src/services/claseService.js
import { api } from "./api";

const claseService = {
  listar: () => api.get("/Clases"),
  obtener: (id) => api.get(`/Clases/${id}`),
  crear: (data) => api.post("/Clases", data),
  actualizar: (id, data) => api.put(`/Clases/${id}`, data),
  eliminar: (id) => api.delete(`/Clases/${id}`)
};

export default claseService;
