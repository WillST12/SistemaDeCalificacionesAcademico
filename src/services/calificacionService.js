import { api } from "./api";

const calificacionService = {
  crear: (data) => api.post("/Calificaciones", data),
  actualizar: (id, data) => api.put(`/Calificaciones/${id}`, data),
  publicar: (id, publicar) =>
    api.put(`/Calificaciones/publicar/${id}`, publicar),

  porClase: (idClase) => api.get(`/Calificaciones/clase/${idClase}`),
  porMateria: (idMateria) => api.get(`/Calificaciones/materia/${idMateria}`),
  porMateriaPeriodo: (idMateria, periodo) =>
    api.get(
      `/Calificaciones/materia/${idMateria}/periodo/${encodeURIComponent(
        periodo
      )}`
    ),
  porAlumno: (idAlumno) => api.get(`/Calificaciones/alumno/${idAlumno}`),

  getById: (id) => api.get(`/Calificaciones/${id}`)
};

export default calificacionService;
