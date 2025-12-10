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
    calificacionService.getById(id)
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

      <div className="bg-white p-4 mb-4 rounded">
        <p><b>Alumno:</b> {form.alumno}</p>
        <p><b>Materia:</b> {form.materia}</p>
        <p><b>Periodo:</b> {form.periodo}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded space-y-4">
        <input
          type="number"
          className="input w-32"
          value={form.nota}
          onChange={(e) => setForm({ ...form, nota: e.target.value })}
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
          />
          Publicado
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
