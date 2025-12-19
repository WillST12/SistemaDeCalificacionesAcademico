// src/services/ClaseAlumnoService.js
import { api } from "./api";

const alumnoClasesService = {
  misClases: (idAlumno) => api.get(`/ClasesAlumnos/alumno/${idAlumno}`),
};

export default alumnoClasesService;
