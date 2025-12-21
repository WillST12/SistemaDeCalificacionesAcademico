/*import { api } from "./api";

const calificacionService = {
  crear: (data) => api.post("/Calificaciones", data),
  actualizar: (id, data) => api.put(`/Calificaciones/${id}`, data),
  publicar: (id, publicar) => api.put(`/Calificaciones/publicar/${id}`, publicar),
  porClase: (idClase) => api.get(`/Calificaciones/clase/${idClase}`),
  porMateria: (idMateria) => api.get(`/Calificaciones/materia/${idMateria}`),
  porMateriaPeriodo: (idMateria, periodo) =>
    api.get(`/Calificaciones/materia/${idMateria}/periodo/${encodeURIComponent(periodo)}`),
  porAlumno: (idAlumno) => api.get(`/Calificaciones/alumno/${idAlumno}`),

  misCalificaciones: (idAlumno) => api.get(`/Calificaciones/misCalificaciones/${idAlumno}`),
  GetById: (id) => api.get(`/Calificaciones/${id}`)
};

export default calificacionService;
*/

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
