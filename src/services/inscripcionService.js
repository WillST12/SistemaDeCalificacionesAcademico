// src/services/inscripcionService.js
import { api } from "./api";

const inscripcionService = {
  inscribir: (data) => api.post("/Inscripciones", data), // { idAlumno, idClase }
  listarPorAlumno: (idAlumno) => api.get(`/Inscripciones/${idAlumno}`),
  // recomendamos añadir: GET /Inscripciones/clase/{idClase} en backend para listar alumnos por clase
};

export default inscripcionService;
