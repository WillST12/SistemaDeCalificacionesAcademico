import { api } from "./api";

const alumnoService = {
  listar: () => api.get("/alumnos"),
  obtener: (id) => api.get(`/alumnos/${id}`),
  crear: (data) => api.post("/alumnos", data),
  actualizar: (id, data) => api.put(`/alumnos/${id}`, data),
  eliminar: (id) => api.delete(`/alumnos/${id}`)
};

export default alumnoService;
