import { api } from "./api";

const calificacionService = {
  crear: (data) =>
    api.post("/Calificaciones", {
      IdClaseAlumno: data.idClaseAlumno,
      Nota: parseFloat(data.nota),
      Publicado: data.publicado,
    }),

  actualizar: (id, data) =>
    api.put(`/Calificaciones/${id}`, {
      Nota: parseFloat(data.nota),
      Publicado: data.publicado,
    }),

  publicar: (idCalificacion, publicado) =>
    api.put(`/Calificaciones/publicar/${idCalificacion}`, {
      Publicado: publicado,
    }),

  porClase: (idClase) =>
    api.get(`/Calificaciones/clase/${idClase}`),

  // 🟢 NUEVO
  archivadasPorClase: (idClase) =>
    api.get(`/Calificaciones/archivadas/clase/${idClase}`),

  // 🟢 NUEVO
  archivadas: () =>
    api.get(`/Calificaciones/archivadas`),

  obtener: (id) =>
    api.get(`/Calificaciones/${id}`),

  misCalificaciones: (idAlumno) =>
    api.get(`/Calificaciones/mis-calificaciones/${idAlumno}`),

  porAlumno: (idAlumno) =>
    api.get(`/Calificaciones/alumno/${idAlumno}`),
};

export default calificacionService;
