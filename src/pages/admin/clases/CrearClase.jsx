import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import materiaService from "../../../services/materiaService";
import profesorService from "../../../services/profesorService";
import profesorMateriaService from "../../../services/profesorMateriaService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function CrearClase() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [form, setForm] = useState({
    idMateria: "",
    idProfesor: "",
    periodo: "",
    activo: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    materiaService.listar().then(res => setMaterias(res.data)).catch(()=>{});
    profesorService.listar().then(res => setProfesores(res.data)).catch(()=>{});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.idMateria || !form.idProfesor || !form.periodo) {
      return alert("Selecciona materia, profesor y periodo.");
    }

    setLoading(true);
    try {
      // 1) crear o obtener ProfesorMateria
      const pmRes = await profesorMateriaService.asignar({
        idProfesor: Number(form.idProfesor),
        idMateria: Number(form.idMateria)
      });
      const idProfesorMateria = pmRes.data.idProfesorMateria ?? pmRes.data?.IdProfesorMateria ?? pmRes.data;

      // 2) crear clase
      await ClaseService.crear({
        idProfesorMateria,
        periodo: form.periodo,
        activo: form.activo
      });

      alert("Clase creada correctamente");
      navigate("/admin/clases");
    } catch (err) {
      console.error(err);
      alert("Error creando la clase. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Crear Clase</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="col-span-2">
          <div className="text-sm text-gray-600">Materia</div>
          <select name="idMateria" value={form.idMateria} onChange={handleChange} className="input w-full">
            <option value="">-- Selecciona --</option>
            {materias.map(m => (
              <option key={m.idMateria ?? m.id} value={m.idMateria ?? m.id}>{m.nombre ?? m.Nombre}</option>
            ))}
          </select>
        </label>

        <label className="col-span-2">
          <div className="text-sm text-gray-600">Profesor</div>
          <select name="idProfesor" value={form.idProfesor} onChange={handleChange} className="input w-full">
            <option value="">-- Selecciona --</option>
            {profesores.map(p => (
              <option key={p.idProfesor ?? p.id} value={p.idProfesor ?? p.id}>
                {(p.nombre ?? p.Nombre) + " " + (p.apellido ?? p.Apellido)}
              </option>
            ))}
          </select>
        </label>

        <input name="periodo" placeholder="Periodo (ej: 2025-2)" value={form.periodo} onChange={handleChange} className="input" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
          Activo
        </label>

        <button className="col-span-2 bg-green-600 text-white py-2 rounded-lg" disabled={loading}>
          {loading ? "Creando..." : "Crear Clase"}
        </button>
      </form>
    </div>
  );
}
