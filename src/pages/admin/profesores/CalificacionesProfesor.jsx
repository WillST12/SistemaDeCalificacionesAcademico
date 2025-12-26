import { useEffect, useMemo, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";
import { useAuth } from "../../../hooks/useAuth";

export default function CalificacionesProfesor() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("listado"); // listado | asignar | archivadas
  const [califs, setCalifs] = useState([]);
  const [clases, setClases] = useState([]);
  const [filtroValor, setFiltroValor] = useState("");
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [alumnosClase, setAlumnosClase] = useState([]);
  const [loading, setLoading] = useState(false);

  const clasesMap = useMemo(() => {
    const map = new Map();
    clases.forEach((c) => map.set(c.idClase, c));
    return map;
  }, [clases]);

  // =========================
  // Cargar clases del profesor
  // =========================
  useEffect(() => {
    if (!user?.idUsuario) return;

    setLoading(true);
    ClaseService.porUsuarioProfesor(user.idUsuario)
      .then((r) => setClases(r.data))
      .catch(() => alert("Error cargando tus clases"))
      .finally(() => setLoading(false));
  }, [user]);

  // =========================
  // Limpieza al cambiar de tab
  // =========================
  useEffect(() => {
    // Limpia resultados para evitar confusión visual entre tabs
    setCalifs([]);
    // no borro filtroValor para que el usuario no tenga que re-seleccionar siempre
    if (activeTab !== "asignar") {
      setClaseSeleccionada("");
      setAlumnosClase([]);
    }
  }, [activeTab]);

  // =========================
  // Validación de clase del profesor
  // =========================
  const validarClaseProfesor = (idClaseStr) => {
    const idClase = parseInt(idClaseStr);
    if (!idClaseStr || Number.isNaN(idClase)) return null;
    return clasesMap.get(idClase) || null;
  };

  // =========================
  // Buscar calificaciones (vigentes o archivadas)
  // =========================
  const buscar = async () => {
    if (!filtroValor) return alert("Selecciona una clase");

    const claseValida = validarClaseProfesor(filtroValor);
    if (!claseValida) return alert("No tienes permiso para ver esta clase");

    setLoading(true);
    try {
      const res =
        activeTab === "archivadas"
          ? await calificacionService.archivadasPorClase(filtroValor)
          : await calificacionService.porClase(filtroValor);

      setCalifs(res.data);
    } catch (e) {
      alert("Error consultando calificaciones");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Cargar alumnos de la clase (solo para asignar vigentes)
  // =========================
  const cargarAlumnosClase = async (idClase) => {
    if (activeTab === "archivadas") {
      alert("Las calificaciones archivadas son solo de lectura.");
      return;
    }

    setClaseSeleccionada(idClase);

    if (!idClase) {
      setAlumnosClase([]);
      return;
    }

    const claseValida = validarClaseProfesor(idClase);
    if (!claseValida) {
      alert("No tienes permiso para gestionar esta clase");
      setAlumnosClase([]);
      return;
    }

    setLoading(true);
    try {
      const alumnos = await ClaseService.alumnos(idClase);
      const califsClase = await calificacionService.porClase(idClase);

      const alumnosConEstado = alumnos.data.map((a) => {
        const cal = califsClase.data.find((c) => c.alumnoId === a.idAlumno);

        return {
          ...a,
          nota: cal ? cal.nota : "",
          publicado: cal ? cal.publicado : false,
          idCalificacion: cal ? cal.idCalificacion : null,
        };
      });

      setAlumnosClase(alumnosConEstado);
    } catch {
      setAlumnosClase([]);
      alert("Error cargando alumnos de la clase");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Guardar calificación (solo vigentes)
  // =========================
  const guardarCalificacion = async (alumno) => {
    if (activeTab === "archivadas") {
      alert("Las calificaciones archivadas no se pueden modificar.");
      return;
    }

    if (alumno.nota === "" || alumno.nota === null || alumno.nota === undefined)
      return alert("Ingresa una nota");

    const claseValida = validarClaseProfesor(claseSeleccionada);
    if (!claseValida) return alert("No tienes permiso para calificar en esta clase");

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
      await cargarAlumnosClase(claseSeleccionada);
      if (filtroValor && (activeTab === "listado" || activeTab === "archivadas")) {
        await buscar();
      }
    } catch {
      alert("Error guardando la calificación");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Estado sin user
  // =========================
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <BackButton />
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isListado = activeTab === "listado" || activeTab === "archivadas";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Calificaciones
          </h1>
          <p className="text-gray-600">Administra las calificaciones de tus clases</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1 inline-flex gap-1">
          <button
            onClick={() => setActiveTab("listado")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "listado"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            📋 Vigentes
          </button>

          <button
            onClick={() => setActiveTab("archivadas")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "archivadas"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            🗄️ Archivadas (Inactivos)
          </button>

          <button
            onClick={() => setActiveTab("asignar")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "asignar"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            ✏️ Asignar y Editar
        </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
            </div>
          </div>
        )}

        {/* LISTADO (Vigentes + Archivadas) */}
        {isListado && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === "archivadas"
                  ? "Filtrar Calificaciones Archivadas"
                  : "Filtrar Calificaciones Vigentes"}
              </h2>

              <div className="flex gap-4">
                <select
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                  onClick={buscar}
                  disabled={loading}
                >
                  {activeTab === "archivadas" ? "📁 Buscar" : "🔍 Buscar"}
                </button>
              </div>
            </div>

            {/* Tabla de Calificaciones */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {califs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-500 text-lg">No hay calificaciones</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Selecciona una clase y haz clic en Buscar
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Alumno
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Materia
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Periodo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nota
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {califs.map((c) => (
                        <tr
                          key={c.idCalificacion}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{c.idCalificacion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {c.alumnoNombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {c.materia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {c.periodo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                              {c.nota}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {c.fechaRegistro
                              ? new Date(c.fechaRegistro).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                c.publicado
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {c.publicado ? "✓ Publicado" : "⏳ Borrador"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {califs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600 text-center">
                  Mostrando{" "}
                  <span className="font-semibold">{califs.length}</span>{" "}
                  calificación{califs.length !== 1 ? "es" : ""}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ASIGNAR */}
        {activeTab === "asignar" && (
          <div className="space-y-6">
            {/* Selector de Clase */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Seleccionar Clase
              </h2>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

            {/* Tabla de Alumnos */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {alumnosClase.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-500 text-lg">
                    Selecciona una clase para ver sus alumnos
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Podrás asignar o editar sus calificaciones
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-white font-semibold text-lg">
                      Alumnos de la Clase
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {alumnosClase.length} alumno
                      {alumnosClase.length !== 1 ? "s" : ""} inscrito
                      {alumnosClase.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Alumno
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nota
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Publicado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {alumnosClase.map((a, index) => (
                          <tr
                            key={a.idClaseAlumno}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold">
                                    {a.nombre?.charAt(0)}
                                    {a.apellido?.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {a.nombre} {a.apellido}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                placeholder="0-100"
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={a.nota}
                                onChange={(e) => {
                                  const copia = [...alumnosClase];
                                  copia[index].nota = e.target.value;
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
                                    copia[index].publicado = e.target.checked;
                                    setAlumnosClase(copia);
                                  }}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                  {a.publicado ? "Sí" : "No"}
                                </span>
                              </label>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => guardarCalificacion(a)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                                disabled={loading}
                              >
                                💾 Guardar
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
        )}
      </div>
    </div>
  );
}
