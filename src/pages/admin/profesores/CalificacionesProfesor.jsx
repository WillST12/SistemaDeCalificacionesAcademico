import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";
import { useAuth } from "../../../hooks/useAuth";

export default function CalificacionesProfesor() {
  const { user } = useAuth(); // Obtener el usuario del contexto
  const [activeTab, setActiveTab] = useState("listado");
  const [califs, setCalifs] = useState([]);
  const [clases, setClases] = useState([]);
  const [filtroValor, setFiltroValor] = useState("");

  // Para asignación
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [alumnosClase, setAlumnosClase] = useState([]);

  // Cargar SOLO las clases del profesor autenticado
  useEffect(() => {
    if (!user?.idUsuario) return;

    // Usar el endpoint específico para el profesor
    ClaseService.porUsuarioProfesor(user.idUsuario)
      .then((r) => {
        setClases(r.data);
      })
      .catch(() => {
        alert("Error cargando tus clases");
      });
  }, [user]);

  // Buscar calificaciones por clase
  const buscar = async () => {
    if (!filtroValor) return alert("Selecciona una clase");

    // Verificar que la clase pertenece al profesor
    const claseValida = clases.find((c) => c.idClase === parseInt(filtroValor));
    if (!claseValida) {
      return alert("No tienes permiso para ver esta clase");
    }

    try {
      const res = await calificacionService.porClase(filtroValor);
      setCalifs(res.data);
    } catch {
      alert("Error consultando calificaciones");
    }
  };

  // Cargar alumnos de la clase + calificaciones existentes
  const cargarAlumnosClase = async (idClase) => {
    setClaseSeleccionada(idClase);

    if (!idClase) {
      setAlumnosClase([]);
      return;
    }

    // Verificar que la clase pertenece al profesor
    const claseValida = clases.find((c) => c.idClase === parseInt(idClase));
    if (!claseValida) {
      alert("No tienes permiso para gestionar esta clase");
      setAlumnosClase([]);
      return;
    }

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
    }
  };

  // Guardar o editar
  const guardarCalificacion = async (alumno) => {
    if (!alumno.nota) return alert("Ingresa una nota");

    // Verificar que la clase seleccionada pertenece al profesor
    const claseValida = clases.find(
      (c) => c.idClase === parseInt(claseSeleccionada)
    );
    if (!claseValida) {
      return alert("No tienes permiso para calificar en esta clase");
    }

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

      alert("Guardado exitosamente");
      cargarAlumnosClase(claseSeleccionada);
      if (filtroValor) buscar();
    } catch {
      alert("Error guardando la calificación");
    }
  };

  // Editar calificación inline
  const editarCalificacion = (calif) => {
    // Verificar que la clase pertenece al profesor
    const claseValida = clases.find((c) => c.idClase === calif.idClase);
    if (!claseValida) {
      return alert("No tienes permiso para editar esta calificación");
    }

    // Cambiar al tab de asignar y pre-cargar los datos
    setActiveTab("asignar");
    cargarAlumnosClase(calif.idClase.toString());
  };

  if (!user) {
    return (
      <div className="p-4">
        <BackButton />
        <p>Cargando información del profesor...</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Mis Calificaciones</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("listado")}
          className={`px-4 py-2 rounded ${
            activeTab === "listado"
              ? "bg-blue-700 text-white"
              : "bg-gray-200"
          }`}
        >
          Calificaciones Registradas
        </button>

        <button
          onClick={() => setActiveTab("asignar")}
          className={`px-4 py-2 rounded ${
            activeTab === "asignar"
              ? "bg-blue-700 text-white"
              : "bg-gray-200"
          }`}
        >
          Asignar Calificación
        </button>
      </div>

      {/* TAB LISTADO */}
      {activeTab === "listado" && (
        <div>
          <div className="bg-white p-4 mb-4 rounded flex gap-4">
            <select
              className="input flex-1"
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
            >
              <option value="">--Selecciona tu clase--</option>
              {clases.map((c) => (
                <option key={c.idClase} value={c.idClase}>
                  {c.materia} — {c.periodo}
                </option>
              ))}
            </select>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={buscar}
            >
              Buscar
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white p-4 rounded">
            {califs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay calificaciones registradas. Selecciona una clase y haz clic en Buscar.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Alumno</th>
                    <th>Materia</th>
                    <th>Periodo</th>
                    <th>Nota</th>
                    <th>Fecha</th>
                    <th>Publicado</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {califs.map((c) => (
                    <tr key={c.idCalificacion}>
                      <td>{c.idCalificacion}</td>
                      <td>{c.alumnoNombre}</td>
                      <td>{c.materia}</td>
                      <td>{c.periodo}</td>
                      <td>{c.nota}</td>
                      <td>{new Date(c.fechaRegistro).toLocaleDateString()}</td>
                      <td>{c.publicado ? "Sí" : "No"}</td>
                      <td>
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                          onClick={() => editarCalificacion(c)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB ASIGNAR */}
      {activeTab === "asignar" && (
        <div className="bg-white p-4 rounded">
          <h2 className="text-xl font-bold mb-3">Asignar Calificación</h2>

          <select
            className="input mb-4"
            value={claseSeleccionada}
            onChange={(e) => cargarAlumnosClase(e.target.value)}
          >
            <option value="">--Selecciona tu clase--</option>
            {clases.map((c) => (
              <option key={c.idClase} value={c.idClase}>
                {c.materia} — {c.periodo}
              </option>
            ))}
          </select>

          {alumnosClase.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Selecciona una clase para ver sus alumnos
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Nota</th>
                  <th>Publicado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {alumnosClase.map((a, index) => (
                  <tr key={a.idClaseAlumno}>
                    <td>{a.alumnoNombre}</td>

                    <td>
                      <input
                        type="number"
                        placeholder="Nota"
                        className="input w-24"
                        value={a.nota}
                        onChange={(e) => {
                          const copia = [...alumnosClase];
                          copia[index].nota = e.target.value;
                          setAlumnosClase(copia);
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={a.publicado}
                        onChange={(e) => {
                          const copia = [...alumnosClase];
                          copia[index].publicado = e.target.checked;
                          setAlumnosClase(copia);
                        }}
                      />
                    </td>

                    <td>
                      <button
                        onClick={() => guardarCalificacion(a)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}