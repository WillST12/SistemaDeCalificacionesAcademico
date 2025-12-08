// src/services/calificacionService.js
import { api } from "./api";

const calificacionService = {
  crear: (data) => api.post("/Calificaciones", data),
  actualizar: (id, data) => api.put(`/Calificaciones/${id}`, data),
  publicar: (id, publicar) => api.put(`/Calificaciones/publicar/${id}`, publicar),
  porClase: (idClase) => api.get(`/Calificaciones/clase/${idClase}`),
  porMateria: (idMateria) => api.get(`/Calificaciones/materia/${idMateria}`),
  porAlumno: (idAlumno) => api.get(`/Calificaciones/alumno/${idAlumno}`)
};

export default calificacionService;
