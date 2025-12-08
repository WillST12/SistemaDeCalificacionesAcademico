// src/pages/admin/calificaciones/CrearCalificacion.jsx
import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import { api } from "../../../services/api"; // o crea un service para inscripciones
import BackButton from "../../../components/ui/BackButton";

export default function CrearCalificacion() {
  const [inscripciones, setInscripciones] = useState([]);
  const [form, setForm] = useState({ idClaseAlumno: "", nota: "", publicado: false });

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get("/Clases/inscripciones"); // endpoint que añadimos arriba
        setInscripciones(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await calificacionService.crear({
        idClaseAlumno: parseInt(form.idClaseAlumno),
        nota: parseFloat(form.nota),
        publicado: form.publicado
      });
      alert("Calificación creada");
    } catch (err) {
      console.error(err);
      alert("Error creando calificación");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Registrar Calificación</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={form.idClaseAlumno} onChange={e=>setForm({...form, idClaseAlumno: e.target.value})} className="input">
          <option value="">-- Selecciona inscripcion (alumno / materia) --</option>
          {inscripciones.map(i => (
            <option key={i.idClaseAlumno ?? i.IdClaseAlumno} value={i.idClaseAlumno ?? i.IdClaseAlumno}>
              {i.alumnoNombre ?? i.AlumnoNombre} — {i.materia ?? i.Materia} ({i.periodo ?? i.Periodo})
            </option>
          ))}
        </select>

        <input name="nota" placeholder="Nota (ej: 89.50)" value={form.nota} onChange={e=>setForm({...form, nota: e.target.value})} className="input" />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.publicado} onChange={(e)=>setForm({...form, publicado: e.target.checked})} /> Publicar (visible al alumno)
        </label>

        <button className="col-span-2 bg-green-600 text-white py-2 rounded">Guardar</button>
      </form>
    </div>
  );
}
