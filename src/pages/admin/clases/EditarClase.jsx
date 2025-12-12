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

  // ------------------------------------
  // 🔹 CARGAR DATOS INICIALES
  // ------------------------------------
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

    } catch (err) {
      alert("Error cargando datos");
      navigate("/admin/clases");
    }
  };

  // ------------------------------------
  // 🔹 GUARDAR CAMBIOS
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idMateria || !form.idProfesor || !form.periodo) {
      return alert("Completa todos los campos");
    }

    try {
      // 1️⃣ Crear / obtener ProfesorMateria
      const pmRes = await profesorMateriaService.asignar({
        idProfesor: Number(form.idProfesor),
        idMateria: Number(form.idMateria)
      });

      const idProfesorMateria =
        pmRes.data.idProfesorMateria ??
        pmRes.data.IdProfesorMateria ??
        pmRes.data;

      // 2️⃣ Actualizar Clase
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
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Clase</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

        {/* MATERIA */}
        <div>
          <label className="block font-semibold mb-1">Materia</label>
          <select
            className="input w-full"
            value={form.idMateria}
            onChange={(e) => setForm({ ...form, idMateria: e.target.value })}
          >
            <option value="">-- Selecciona materia --</option>
            {materias.map(m => (
              <option key={m.idMateria ?? m.IdMateria} value={m.idMateria ?? m.IdMateria}>
                {m.nombre ?? m.Nombre}
              </option>
            ))}
          </select>
        </div>

        {/* PROFESOR */}
        <div>
          <label className="block font-semibold mb-1">Profesor</label>
          <select
            className="input w-full"
            value={form.idProfesor}
            onChange={(e) => setForm({ ...form, idProfesor: e.target.value })}
          >
            <option value="">-- Selecciona profesor --</option>
            {profesores.map(p => (
              <option key={p.idProfesor ?? p.IdProfesor} value={p.idProfesor ?? p.IdProfesor}>
                {p.nombre ?? p.Nombre} {p.apellido ?? p.Apellido}
              </option>
            ))}
          </select>
        </div>

        {/* PERIODO */}
        <div>
          <label className="block font-semibold mb-1">Periodo</label>
          <input
            className="input w-full"
            placeholder="Ej: Sep 2025 - Ene 2026"
            value={form.periodo}
            onChange={(e) => setForm({ ...form, periodo: e.target.value })}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
