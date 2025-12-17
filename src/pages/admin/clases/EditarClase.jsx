import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import materiaService from "../../../services/materiaService";
import profesorService from "../../../services/profesorService";
import profesorMateriaService from "../../../services/profesorMateriaService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarClase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const [form, setForm] = useState({
    periodo: "",
    idMateria: "",
    idProfesor: ""
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [claseRes, materiasRes, profesoresRes] = await Promise.all([
        ClaseService.obtener(id),
        materiaService.listar(),
        profesorService.listar()
      ]);

      const clase = claseRes.data;

      setMaterias(materiasRes.data);
      setProfesores(profesoresRes.data);

      setForm({
        periodo: clase.periodo ?? clase.Periodo,
        idMateria:
          clase.profesorMateria?.idMateria ??
          clase.ProfesorMateria?.IdMateria,
        idProfesor:
          clase.profesorMateria?.idProfesor ??
          clase.ProfesorMateria?.IdProfesor
      });

    } catch {
      alert("Error cargando datos");
      navigate("/admin/clases");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idMateria || !form.idProfesor || !form.periodo) {
      return alert("Completa todos los campos");
    }

    try {
      const pmRes = await profesorMateriaService.asignar({
        idProfesor: Number(form.idProfesor),
        idMateria: Number(form.idMateria)
      });

      const idProfesorMateria =
        pmRes.data.idProfesorMateria ??
        pmRes.data.IdProfesorMateria ??
        pmRes.data;

      await ClaseService.actualizar(id, {
        idProfesorMateria,
        periodo: form.periodo,
        activo: true
      });

      alert("Clase actualizada correctamente");
      navigate("/admin/clases");

    } catch (err) {
      console.error(err);
      alert("Error actualizando la clase");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton />

      <h1 className="text-3xl font-bold mb-6">
        Editar Clase
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        {/* Materia */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Materia
          </label>
          <select
            value={form.idMateria}
            onChange={(e) => setForm({ ...form, idMateria: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Selecciona materia --</option>
            {materias.map(m => (
              <option
                key={m.idMateria ?? m.IdMateria}
                value={m.idMateria ?? m.IdMateria}
              >
                {m.nombre ?? m.Nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Profesor
          </label>
          <select
            value={form.idProfesor}
            onChange={(e) => setForm({ ...form, idProfesor: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Selecciona profesor --</option>
            {profesores.map(p => (
              <option
                key={p.idProfesor ?? p.IdProfesor}
                value={p.idProfesor ?? p.IdProfesor}
              >
                {p.nombre ?? p.Nombre} {p.apellido ?? p.Apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Periodo */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Periodo
          </label>
          <input
            type="text"
            placeholder="Ej: Sep 2025 - Ene 2026"
            value={form.periodo}
            onChange={(e) => setForm({ ...form, periodo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
