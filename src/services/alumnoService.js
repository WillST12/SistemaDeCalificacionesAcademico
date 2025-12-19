// src/services/alumnoService.js
import { api } from "./api";

const alumnoService = {
  listar: () => api.get("/Alumnos"),
  obtener: (id) => api.get(`/Alumnos/${id}`),
  crear: (data) => api.post("/Alumnos", data),
  actualizar: (id, data) => api.put(`/Alumnos/${id}`, data),

  desactivar: (id) => api.put(`/Alumnos/desactivar/${id}`),
  reactivar: (id) => api.put(`/Alumnos/reactivar/${id}`),

  // ✅ Alumno: convertir idUsuario -> idAlumno
  porUsuario: (idUsuario) => api.get(`/Alumnos/por-usuario/${idUsuario}`),
};

export default alumnoService;
