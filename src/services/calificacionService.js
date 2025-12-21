

import { api } from "./api";

const calificacionService = {
  crear: (data) => api.post("/Calificaciones", data),
  actualizar: (id, data) => api.put(`/Calificaciones/${id}`, data),
  porClase: (idClase) => api.get(`/Calificaciones/clase/${idClase}`),
  obtener: (id) => api.get(`/Calificaciones/${id}`),
 
  misCalificaciones: (idAlumno) =>
    api.get(`/Calificaciones/mis-calificaciones/${idAlumno}`),

  porProfesor: (idProfesor) => api.get(`/Calificaciones/profesor/${idProfesor}`),
  porAlumno: (idAlumno) => api.get(`/Calificaciones/alumno/${idAlumno}`),
};

export default calificacionService;
