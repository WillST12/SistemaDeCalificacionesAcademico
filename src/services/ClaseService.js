import { api } from "./api";

const ClaseService = {
  listar: () => api.get("/Clases"),
  obtener: (id) => api.get(`/Clases/${id}`),
  crear: (data) => api.post("/Clases", data),
  actualizar: (id, data) => api.put(`/Clases/${id}`, data),
  eliminar: (id) => api.delete(`/Clases/${id}`),

  // Devuelve los alumnos inscritos en una clase -> GET /api/ClasesAlumnos/{idClase}
  alumnos: (idClase) => api.get(`/ClasesAlumnos/${idClase}`),

  // Devuelve todas las inscripciones (para select al crear calificación) -> GET /api/ClasesAlumnos/inscripciones
  inscripciones: () => api.get("/ClasesAlumnos/inscripciones"),
  porProfesor: (idProfesor) => api.get(`/Clases/profesor/${idProfesor}`)
};

export default ClaseService;
