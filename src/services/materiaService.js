import { api } from "./api";

const materiaService = {
  listar: () => api.get("/Materias"),
  obtener: (id) => api.get(`/Materias/${id}`),
  crear: (data) => api.post("/Materias", data),
  actualizar: (id, data) => api.put(`/Materias/${id}`, data),
  eliminar: (id) => api.delete(`/Materias/${id}`)
};

export default materiaService;
