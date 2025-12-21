import { api } from "./api";

const ClaseService = {
  listar: () => api.get("/Clases"),
  obtener: (id) => api.get(`/Clases/${id}`),
  crear: (data) => api.post("/Clases", data),
  actualizar: (id, data) => api.put(`/Clases/${id}`, data),
  eliminar: (id) => api.delete(`/Clases/${id}`),

  alumnos: (idClase) => api.get(`/Clases/${idClase}/alumnos`),

  // ✅ PROFESOR POR USUARIO
  porUsuarioProfesor: (idUsuario) =>
    api.get(`/Clases/profesor/usuario/${idUsuario}`)
};

export default ClaseService;

