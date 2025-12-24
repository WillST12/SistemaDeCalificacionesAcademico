import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";
import { useNavigate } from "react-router-dom";

export default function CalificacionesListado() {
  const navigate = useNavigate();

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
  // Buscar calificaciones
  // ===============================
  const buscar = async () => {
    if (!filtroValor) return alert("Selecciona una clase");

    setLoading(true);
    try {
      const res = await calificacionService.porClase(filtroValor);
      setCalifs(res.data);
    } catch {
      alert("Error consultando calificaciones");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Cargar alumnos + calificaciones
  // ===============================
  const cargarAlumnosClase = async (idClase) => {
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
  // Guardar / editar
  // ===============================
  const guardarCalificacion = async (alumno) => {
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

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Calificaciones
          </h1>
          <p className="text-gray-600">
            Administración general de calificaciones del sistema
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("listado")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "listado"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            📋 Calificaciones Registradas
          </button>

          <button
            onClick={() => setActiveTab("asignar")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "asignar"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            ✏️ Asignar y Editar Calificación
          </button>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
            </div>
          </div>
        )}

        {/* ================= TAB LISTADO ================= */}
        {activeTab === "listado" && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filtrar Calificaciones
              </h2>

              <div className="flex gap-4">
                <select
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  🔍 Buscar
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {califs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-500 text-lg">
                    No hay calificaciones registradas
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Alumno</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Materia</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Periodo</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nota</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vigencia</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {califs.map((c) => (
                        <tr key={c.idCalificacion} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            #{c.idCalificacion}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {c.alumnoNombre}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{c.materia}</td>
                          <td className="px-6 py-4 text-gray-600">{c.periodo}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                              {c.nota}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(c.fechaRegistro).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                c.publicado
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {c.publicado ? "✓ Publicado" : "⏳ Borrador"}
                            </span>
                          </td>
                         
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                c.vigente
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {c.vigente ? "✓ Vigente" : "📁 Histórico"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB ASIGNAR ================= */}
        {activeTab === "asignar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Seleccionar Clase</h2>

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
              {alumnosClase.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-500 text-lg">
                    Selecciona una clase para ver los alumnos
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Alumno</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nota</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Publicado</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {alumnosClase.map((a, i) => (
                        <tr key={a.idClaseAlumno}>
                          <td className="px-6 py-4 font-medium">
                            {a.nombre} {a.apellido}
                          </td>
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
                             <td className="px-6 py-4 whitespace-nowrap">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                  checked={a.publicado}
                                  onChange={(e) => {
                                    const copia = [...alumnosClase];
                                    copia[i].publicado = e.target.checked;
                                    setAlumnosClase(copia);
                                  }}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                  {a.publicado ? "Sí" : "No"}
                                </span>
                              </label>
                            </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => guardarCalificacion(a)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              💾 Guardar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
