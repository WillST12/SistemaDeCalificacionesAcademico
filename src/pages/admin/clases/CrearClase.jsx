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

      alert("✓ Clase creada correctamente");
      navigate("/admin/clases");
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Error creando la clase";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Clase</h1>
          <p className="text-gray-600">Asigna una materia y profesor para crear una nueva clase</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          
          {/* Materia */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Materia *
            </label>
            <select 
              name="idMateria" 
              value={form.idMateria} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">-- Selecciona una materia --</option>
              {materias
                .filter(m => m.activo) // ✅ Solo materias activas
                .map(m => (
                  <option key={m.idMateria} value={m.idMateria}>
                    {m.nombre}
                  </option>
                ))
              }
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Solo se muestran materias activas
            </p>
          </div>

          {/* Profesor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profesor *
            </label>
            <select 
              name="idProfesor" 
              value={form.idProfesor} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">-- Selecciona un profesor --</option>
              {profesores
                .filter(p => p.activo || p.Activo) // ✅ Solo profesores activos
                .map(p => (
                  <option key={p.idProfesor ?? p.id} value={p.idProfesor ?? p.id}>
                    {(p.nombre ?? p.Nombre)} {(p.apellido ?? p.Apellido)}
                  </option>
                ))
              }
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Solo se muestran profesores activos
            </p>
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Periodo *
            </label>
            <input 
              name="periodo" 
              placeholder="Ej: 2025-1, Enero-Marzo 2025" 
              value={form.periodo} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="activo"
              name="activo" 
              checked={form.activo} 
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="activo" className="text-sm font-medium text-gray-700 cursor-pointer">
              Clase activa
            </label>
          </div>

          {/* Botón */}
          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Creando..." : "✓ Crear Clase"}
          </button>
        </form>
      </div>
    </div>
  );
}