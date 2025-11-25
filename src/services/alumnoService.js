import { api } from "./api";

const alumnoService = {
  listar: () => api.get("/Alumnos"),
  obtener: (id) => api.get(`/Alumnos/${id}`),
  crear: (data) => api.post("/Alumnos", data),
  actualizar: (id, data) => api.put(`/Alumnos/${id}`, data),
  eliminar: (id) => api.delete(`/Alumnos/${id}`)
};

export default alumnoService;
