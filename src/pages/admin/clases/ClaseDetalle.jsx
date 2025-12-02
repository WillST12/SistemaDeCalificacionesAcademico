// src/pages/admin/clases/ClaseDetalle.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import inscripcionService from "../../../services/inscripcionService";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function ClaseDetalle() {
  const { id } = useParams();
  const [clase, setClase] = useState(null);
  const [alumnos, setAlumnos] = useState([]); // para dropdown de inscribir
  const [idAlumno, setIdAlumno] = useState("");

  useEffect(() => {
    ClaseService.obtener(id).then(res => setClase(res.data)).catch(err => console.error(err));
    alumnoService.listar().then(res => setAlumnos(res.data)).catch(err => console.error(err));
    // Si tienes endpoint para listar alumnos inscritos por clase, llámalo aquí y muéstralos
  }, [id]);

  const inscribir = async () => {
    if (!idAlumno) return alert("Selecciona un alumno");
    try {
      await inscripcionService.inscribir({ idAlumno: Number(idAlumno), idClase: Number(id) });
      alert("Alumno inscrito");
      // recargar listado de inscripciones si existe endpoint
    } catch (err) {
      console.error(err);
      alert("Error inscribiendo");
    }
  };

  if (!clase) return <p>Cargando...</p>;

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Clase: {clase.materia} — {clase.profesor}</h1>
      <p>Periodo: {clase.periodo}</p>

      <div className="mt-6 bg-white p-4 rounded shadow max-w-lg">
        <h3 className="font-semibold mb-2">Inscribir alumno</h3>
        <select className="input mb-2" value={idAlumno} onChange={e => setIdAlumno(e.target.value)}>
          <option value="">-- Selecciona alumno --</option>
          {alumnos.map(a => <option key={a.idAlumno} value={a.idAlumno}>{a.nombre} {a.apellido} — {a.matricula}</option>)}
        </select>
        <button onClick={inscribir} className="bg-green-600 text-white px-4 py-2 rounded">Inscribir</button>
      </div>

      {/* Aquí podrías mostrar la lista de alumnos inscritos (si tu backend ofrece endpoint). */}
    </div>
  );
}
