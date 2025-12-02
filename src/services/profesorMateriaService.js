// src/services/profesorMateriaService.js
import { api } from "./api";

const profesorMateriaService = {
  listar: () => api.get("/ProfesorMaterias"),
  listarPorProfesor: (idProfesor) => api.get(`/ProfesorMaterias/profesor/${idProfesor}`),
  crear: (data) => api.post("/ProfesorMaterias", data),
  eliminar: (id) => api.delete(`/ProfesorMaterias/${id}`)
};

export default profesorMateriaService;
