import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ClaseService from "../../../services/ClaseService";
import inscripcionService from "../../../services/inscripcionService";
import alumnoService from "../../../services/alumnoService";

import BackButton from "../../../components/ui/BackButton";

export default function ClaseDetalle() {
  const { id } = useParams();

  const [clase, setClase] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
  const [idAlumno, setIdAlumno] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // === 1) Obtener información de la clase ===
    const resClase = await ClaseService.obtener(id);
    setClase(resClase.data);

    // === 2) Obtener alumnos inscritos ===
    const resInscritos = await ClaseService.alumnos(id);
    setAlumnos(resInscritos.data);

    // === 3) Obtener alumnos activos ===
    const resDisponibles = await alumnoService.listar();
    setAlumnosDisponibles(resDisponibles.data);
  };

  const inscribir = async () => {
    if (!idAlumno) return alert("Seleccione un alumno");

    try {
      await inscripcionService.inscribirAdmin({
        idClase: parseInt(id),
        idAlumno: parseInt(idAlumno),
      });

      alert("Alumno inscrito correctamente");
      setIdAlumno("");
      cargarDatos();
    } catch (err) {
      alert(err.response?.data || "Error al inscribir");
    }
  };

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Detalle de Clase</h1>

      {clase && (
        <div className="bg-white p-4 shadow rounded mb-6">
          <p><strong>Periodo:</strong> {clase.periodo}</p>
          <p><strong>Materia:</strong> {clase.materia}</p>
          <p><strong>Profesor:</strong> {clase.profesor}</p>
        </div>
      )}

      <hr className="my-6" />

      {/* INSCRIBIR ALUMNO */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">Inscribir Alumno</h2>

        <div className="flex gap-2">
          <select
            className="input flex-1"
            value={idAlumno}
            onChange={(e) => setIdAlumno(e.target.value)}
          >
            <option value="">-- Seleccione un alumno --</option>
            {alumnosDisponibles.map(a => (
              <option key={a.idAlumno} value={a.idAlumno}>
                {a.nombre} {a.apellido} — {a.matricula}
              </option>
            ))}
          </select>

          <button
            onClick={inscribir}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Inscribir
          </button>
        </div>
      </div>

      {/* ALUMNOS INSCRITOS */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Alumnos Inscritos</h2>

        {alumnos.length === 0 ? (
          <p className="text-gray-600">No hay alumnos inscritos en esta clase.</p>
        ) : (
          <ul className="list-disc pl-6">
            {alumnos.map(a => (
              <li key={a.idAlumno}>
                {a.nombre} {a.apellido} — {a.matricula}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
