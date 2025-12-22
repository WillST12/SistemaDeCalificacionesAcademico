import { api } from "./api";

const calificacionService = {
  // ✅ Mapear a PascalCase
  crear: (data) => api.post("/Calificaciones", {
    IdClaseAlumno: data.idClaseAlumno,
    Nota: parseFloat(data.nota),
    Publicado: data.publicado
  }),

  // ✅ Mapear a PascalCase
  actualizar: (id, data) => api.put(`/Calificaciones/${id}`, {
    Nota: parseFloat(data.nota),
    Publicado: data.publicado
  }),

  // ✅ NUEVO: Publicar/Despublicar calificación
  publicar: (idCalificacion, publicado) => 
    api.put(`/Calificaciones/publicar/${idCalificacion}`, {
      Publicado: publicado
    }),

  porClase: (idClase) => api.get(`/Calificaciones/clase/${idClase}`),
  
  obtener: (id) => api.get(`/Calificaciones/${id}`),
 
  misCalificaciones: (idAlumno) =>
    api.get(`/Calificaciones/mis-calificaciones/${idAlumno}`),

  porProfesor: (idProfesor) => 
    api.get(`/Calificaciones/profesor/${idProfesor}`),
    
  porAlumno: (idAlumno) => 
    api.get(`/Calificaciones/alumno/${idAlumno}`),
};

export default calificacionService;