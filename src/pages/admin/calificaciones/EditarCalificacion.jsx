// src/pages/admin/calificaciones/EditarCalificacion.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import calificacionService from "../../../services/calificacionService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarCalificacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nota: "",
    publicado: false,
    alumno: "",
    materia: "",
    periodo: ""
  });

  useEffect(() => {
    calificacionService.GetById(id)
      .then((res) => {
        setForm({
          nota: res.data.nota,
          publicado: res.data.publicado,
          alumno: res.data.alumno,
          materia: res.data.materia,
          periodo: res.data.periodo
        });
      })
      .catch(() => {
        alert("Error cargando datos");
        navigate("/admin/calificaciones");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await calificacionService.actualizar(id, {
        nota: parseFloat(form.nota),
        publicado: form.publicado
      });

      alert("Calificación actualizada");
      navigate("/admin/calificaciones");
    } catch {
      alert("Error actualizando");
    }
  };

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Editar Calificación</h1>

      {/* ----------- info superior ------------ */}
      <div className="bg-white p-4 mb-4 rounded shadow-sm border">
        <p><b>Alumno:</b> {form.alumno}</p>
        <p><b>Materia:</b> {form.materia}</p>
        <p><b>Periodo:</b> {form.periodo}</p>
      </div>

      {/* ----------- formulario editar ----------- */}
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-sm border space-y-6 max-w-md"
      >
        <div>
          <label className="block mb-1 font-semibold">Nueva Nota</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 87.50"
            className="input w-full"
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
          />
          Publicado
        </label>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
