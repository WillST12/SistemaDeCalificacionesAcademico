import { api } from "./api";

const InscripcionesService = {
  inscribirAdmin: (data) => api.post("/Inscripciones/admin", data),
  inscripcionesPorAlumno: (idAlumno) => api.get(`/Inscripciones/${idAlumno}`)
};

export default InscripcionesService;
