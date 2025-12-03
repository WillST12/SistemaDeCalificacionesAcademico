// src/services/profesorMateriaService.js
import { api } from "./api";

const profesorMateriaService = {
  listar: () => api.get("/ProfesorMaterias"),

  listarPorProfesor: (idProfesor) =>
    api.get(`/ProfesorMaterias/profesor/${idProfesor}`),

  asignar: (data) =>
    api.post("/ProfesorMaterias", data),   // <-- ESTA ES LA CORRECTA

  quitar: (data) =>
    api.delete("/ProfesorMaterias", { data }), // <-- DELETE con body
};

export default profesorMateriaService;
