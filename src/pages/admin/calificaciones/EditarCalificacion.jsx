// src/pages/admin/calificaciones/EditarCalificacion.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import calificacionService from "../../../services/calificacionService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarCalificacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nota: "", publicado: false });

  useEffect(() => {
    calificacionService.porClase(id) // si no tienes endpoint por id, ajustar: crear endpoint GET /Calificaciones/{id}
      .then(res => {
        // si traes por id, asignar aquí. Si no, haz endpoint GET /Calificaciones/{id}
      }).catch(()=>{});
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await calificacionService.actualizar(id, { nota: parseFloat(form.nota), publicado: form.publicado });
      alert("Actualizado");
      navigate("/admin/calificaciones");
    } catch (err) {
      alert("Error actualizando");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Calificación</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded">
        <input value={form.nota} onChange={e=>setForm({...form, nota:e.target.value})} className="input" />
        <label><input type="checkbox" checked={form.publicado} onChange={e=>setForm({...form, publicado: e.target.checked})} /> Publicado</label>
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
      </form>
    </div>
  )
}
