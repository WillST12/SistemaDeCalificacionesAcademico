import { useEffect, useState, useMemo } from "react";
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
  const [search, setSearch] = useState("");
  const [loadingInscribir, setLoadingInscribir] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const resClase = await ClaseService.obtener(id);
    setClase(resClase.data);

    const resInscritos = await ClaseService.alumnos(id);
    setAlumnos(resInscritos.data);

    const resDisponibles = await alumnoService.listar();
    setAlumnosDisponibles(resDisponibles.data);
  };

  const inscribir = async () => {
    if (!idAlumno) return alert("Seleccione un alumno");

    try {
      setLoadingInscribir(true);
      await inscripcionService.inscribirAdmin({
        idClase: parseInt(id),
        idAlumno: parseInt(idAlumno),
      });

      setIdAlumno("");
      cargarDatos();
    } catch (err) {
      alert(err.response?.data || "Error al inscribir");
    } finally {
      setLoadingInscribir(false);
    }
  };

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) =>
      `${a.nombre} ${a.apellido} ${a.matricula}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [alumnos, search]);

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          📘 Detalle de Clase
        </h1>
        <span className="text-sm text-gray-500">
          Alumnos inscritos: {alumnos.length}
        </span>
      </div>

      {/* Info clase */}
      {clase && (
        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Periodo</p>
            <p className="font-semibold text-gray-800">{clase.periodo}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Materia</p>
            <p className="font-semibold text-gray-800">{clase.materia}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Profesor</p>
            <p className="font-semibold text-gray-800">{clase.profesor}</p>
          </div>
        </div>
      )}

      {/* Inscribir alumno */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          ➕ Inscribir Alumno
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="px-4 py-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={idAlumno}
            onChange={(e) => setIdAlumno(e.target.value)}
          >
            <option value="">Seleccione un alumno</option>
            {alumnosDisponibles.map((a) => (
              <option key={a.idAlumno} value={a.idAlumno}>
                {a.nombre} {a.apellido} — {a.matricula}
              </option>
            ))}
          </select>

          <button
            onClick={inscribir}
            disabled={!idAlumno || loadingInscribir}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingInscribir ? "Inscribiendo..." : "Inscribir"}
          </button>
        </div>
      </div>

      {/* Alumnos inscritos */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            👨‍🎓 Alumnos Inscritos
          </h2>

          <input
            type="text"
            placeholder="Buscar alumno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {alumnosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No hay alumnos inscritos en esta clase 📭
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Matrícula</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.map((a) => (
                  <tr
                    key={a.idAlumno}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {a.nombre} {a.apellido}
                    </td>
                    <td className="p-3 text-gray-600">{a.matricula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
