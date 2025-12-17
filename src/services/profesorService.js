import { api } from "./api";

const profesorService = {
  listar: () => api.get("/Profesores"),
  obtener: (id) => api.get(`/Profesores/${id}`),
  crear: (data) => api.post("/Profesores", data),
  actualizar: (id, data) => api.put(`/Profesores/${id}`, data),
  eliminar: (id) => api.put(`/Profesores/desactivar/${id}`),
  desactivar: (id) => api.put(`/Profesores/desactivar/${id}`),
  reactivar: (id) => api.put(`/Profesores/reactivar/${id}`)
};

export default profesorService;
