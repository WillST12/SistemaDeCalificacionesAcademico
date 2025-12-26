import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function CalificacionesListado() {
  const [activeTab, setActiveTab] = useState("listado");
  const [califs, setCalifs] = useState([]);
  const [clases, setClases] = useState([]);
  const [filtroValor, setFiltroValor] = useState("");

  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [alumnosClase, setAlumnosClase] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Cargar clases (ADMIN)
  // ===============================
  useEffect(() => {
    setLoading(true);
    ClaseService.listar()
      .then((r) => setClases(r.data))
      .finally(() => setLoading(false));
  }, []);

  // ===============================
  // Buscar calificaciones (VIGENTES / ARCHIVADAS)
  // ===============================
  const buscar = async () => {
    if (!filtroValor) return alert("Selecciona una clase");

    setLoading(true);
    try {
      const res =
        activeTab === "archivadas"
          ? await calificacionService.archivadasPorClase(filtroValor)
          : await calificacionService.porClase(filtroValor);

      setCalifs(res.data);
    } catch {
      alert("Error consultando calificaciones");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Cargar alumnos + calificaciones (solo VIGENTES)
  // ===============================
  const cargarAlumnosClase = async (idClase) => {
    if (activeTab === "archivadas") {
      alert("No se pueden modificar calificaciones archivadas");
      return;
    }

    setClaseSeleccionada(idClase);
    if (!idClase) {
      setAlumnosClase([]);
      return;
    }

    setLoading(true);
    try {
      const alumnos = await ClaseService.alumnos(idClase);
      const califsClase = await calificacionService.porClase(idClase);

      const alumnosConEstado = alumnos.data.map((a) => {
        const cal = califsClase.data.find(
          (c) => c.alumnoId === a.idAlumno
        );

        return {
          ...a,
          nota: cal ? cal.nota : "",
          publicado: cal ? cal.publicado : false,
          idCalificacion: cal ? cal.idCalificacion : null,
        };
      });

      setAlumnosClase(alumnosConEstado);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Guardar / editar (solo VIGENTES)
  // ===============================
  const guardarCalificacion = async (alumno) => {
    if (activeTab === "archivadas") {
      alert("No se pueden modificar calificaciones archivadas");
      return;
    }

    if (!alumno.nota) return alert("Ingresa una nota");

    setLoading(true);
    try {
      if (alumno.idCalificacion) {
        await calificacionService.actualizar(alumno.idCalificacion, {
          nota: parseFloat(alumno.nota),
          publicado: alumno.publicado,
        });
      } else {
        await calificacionService.crear({
          idClaseAlumno: alumno.idClaseAlumno,
          nota: parseFloat(alumno.nota),
          publicado: alumno.publicado,
        });
      }

      alert("✓ Calificación guardada exitosamente");
      cargarAlumnosClase(claseSeleccionada);
      if (filtroValor) buscar();
    } catch {
      alert("Error guardando la calificación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Calificaciones
          </h1>
          <p className="text-gray-600">
            Administración general de calificaciones del sistema
          </p>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("listado")}
            className={`px-6 py-3 rounded-md font-medium ${
              activeTab === "listado"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📋 Vigentes
          </button>

          <button
            onClick={() => setActiveTab("archivadas")}
            className={`px-6 py-3 rounded-md font-medium ${
              activeTab === "archivadas"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🗄️ Archivadas (Inactivos)
          </button>

          <button
            onClick={() => {
              setActiveTab("asignar");
            }}
            className={`px-6 py-3 rounded-md font-medium ${
              activeTab === "asignar"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ✏️ Asignar
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
            </div>
          </div>
        )}

        {/* LISTADO Y ARCHIVADAS (MISMO JSX) */}
        {(activeTab === "listado" || activeTab === "archivadas") && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                {activeTab === "archivadas"
                  ? "Calificaciones Archivadas"
                  : "Calificaciones Vigentes"}
              </h2>

              <div className="flex gap-4">
                <select
                  className="flex-1 px-4 py-3 border rounded-lg"
                  value={filtroValor}
                  onChange={(e) => setFiltroValor(e.target.value)}
                >
                  <option value="">-- Selecciona una clase --</option>
                  {clases.map((c) => (
                    <option key={c.idClase} value={c.idClase}>
                      {c.materia} — {c.periodo}
                    </option>
                  ))}
                </select>

                <button
                  onClick={buscar}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                  🔍 Buscar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {califs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No hay calificaciones
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Alumno</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Materia</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Periodo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Nota</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold">Vigencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {califs.map((c) => (
                      <tr key={c.idCalificacion}>
                        <td className="px-6 py-4">{c.alumnoNombre}</td>
                        <td className="px-6 py-4">{c.materia}</td>
                        <td className="px-6 py-4">{c.periodo}</td>
                        <td className="px-6 py-4 font-semibold">{c.nota}</td>
                        <td className="px-6 py-4">
                          {c.publicado ? "Publicado" : "Borrador"}
                        </td>
                        <td className="px-6 py-4">
                          {c.vigente ? "Vigente" : "Archivado"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ASIGNAR */}
        {activeTab === "asignar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <select
                className="w-full px-4 py-3 border rounded-lg"
                value={claseSeleccionada}
                onChange={(e) => cargarAlumnosClase(e.target.value)}
              >
                <option value="">-- Selecciona tu clase --</option>
                {clases.map((c) => (
                  <option key={c.idClase} value={c.idClase}>
                    {c.materia} — {c.periodo}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y">
                  {alumnosClase.map((a, i) => (
                    <tr key={a.idClaseAlumno}>
                      <td className="px-6 py-4">{a.nombre} {a.apellido}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-28 px-3 py-2 border rounded-lg"
                          value={a.nota}
                          onChange={(e) => {
                            const copia = [...alumnosClase];
                            copia[i].nota = e.target.value;
                            setAlumnosClase(copia);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => guardarCalificacion(a)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
