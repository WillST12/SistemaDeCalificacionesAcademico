import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import materiaService from "../../../services/materiaService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function CalificacionesListado() {
  const [activeTab, setActiveTab] = useState("listado");
  const [califs, setCalifs] = useState([]);

  const [materias, setMaterias] = useState([]);
  const [clases, setClases] = useState([]);

  const [filtroTipo, setFiltroTipo] = useState("clase");
  const [filtroValor, setFiltroValor] = useState("");

  // Para asignación
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [alumnosClase, setAlumnosClase] = useState([]);
  const [notaPorAlumno, setNotaPorAlumno] = useState({}); // {idClaseAlumno: nota}
  const [publicadoPorAlumno, setPublicadoPorAlumno] = useState({}); // {idClaseAlumno: bool}

  useEffect(() => {
    materiaService.listar().then(r => setMaterias(r.data)).catch(()=>{});
    ClaseService.listar().then(r => setClases(r.data)).catch(()=>{});
  }, []);

  // Buscar calificaciones según tipo
  const buscar = async () => {
    try {
      let res;
      if (filtroTipo === "clase") {
        if (!filtroValor) return alert("Selecciona una clase");
        res = await calificacionService.porClase(filtroValor);
      } else if (filtroTipo === "materia") {
        if (!filtroValor) return alert("Selecciona una materia");
        res = await calificacionService.porMateria(filtroValor);
      } else if (filtroTipo === "alumno") {
        if (!filtroValor) return alert("Ingresa ID de alumno");
        res = await calificacionService.porAlumno(filtroValor);
      }
      setCalifs(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error consultando calificaciones");
    }
  };

  // Buscar por materia + periodo (opcional): usa porMateriaPeriodo
  const buscarMateriaPeriodo = async (idMateria, periodo) => {
    if (!idMateria || !periodo) return alert("Selecciona materia y periodo");
    try {
      const res = await calificacionService.porMateriaPeriodo(idMateria, periodo);
      setCalifs(res.data || []);
      setActiveTab("listado");
    } catch (err) {
      console.error(err);
      alert("Error consultando por materia y periodo");
    }
  };

  // Cargar alumnos de una clase (para asignar)
  const cargarAlumnosClase = async (idClase) => {
    setClaseSeleccionada(idClase);
    setAlumnosClase([]);
    setNotaPorAlumno({});
    setPublicadoPorAlumno({});

    if (!idClase) return;

    try {
      const res = await ClaseService.alumnos(idClase);
      // res.data = [{ idClaseAlumno, idClase, idAlumno, alumnoNombre, ... }]
      setAlumnosClase(res.data || []);
      // inicializar controles
      const notas = {};
      const publicados = {};
      (res.data || []).forEach(a => {
        notas[a.idClaseAlumno] = "";
        publicados[a.idClaseAlumno] = false;
      });
      setNotaPorAlumno(notas);
      setPublicadoPorAlumno(publicados);
    } catch (err) {
      console.error(err);
      alert("Error cargando alumnos de la clase");
    }
  };

  // Guardar calificación para un idClaseAlumno
  const guardarCalificacion = async (idClaseAlumno) => {
    const nota = notaPorAlumno[idClaseAlumno];
    const publicado = publicadoPorAlumno[idClaseAlumno];

    if (!nota && nota !== 0) return alert("Ingresa una nota");

    try {
      await calificacionService.crear({
        idClaseAlumno,
        nota: parseFloat(nota),
        publicado: !!publicado
      });
      alert("Calificación guardada");
      // refrescar listado actual si hay filtro aplicado
      buscar();
    } catch (err) {
      console.error(err);
      alert("Error guardando calificación");
    }
  };

  // Publicar/despublicar desde listado
  const togglePublicar = async (idCalificacion, estado) => {
    try {
      await calificacionService.publicar(idCalificacion, !estado);
      buscar();
    } catch (err) {
      console.error(err);
      alert("Error cambiando estado de publicación");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Calificaciones</h1>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setActiveTab("listado")}
          className={`px-4 py-2 rounded ${activeTab==="listado" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
        >
          Calificaciones Registradas
        </button>

        <button 
          onClick={() => setActiveTab("asignar")}
          className={`px-4 py-2 rounded ${activeTab==="asignar" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
        >
          Asignar Calificación
        </button>
      </div>

      {/* TAB: LISTADO */}
      {activeTab === "listado" && (
        <div>
          <div className="bg-white p-4 rounded mb-4">
            <div className="flex gap-2 items-center">

              <select 
                value={filtroTipo} 
                onChange={e => {setFiltroTipo(e.target.value); setFiltroValor("")}}
                className="input"
              >
                <option value="clase">Por Clase</option>
                <option value="materia">Por Materia</option>
                <option value="alumno">Por Alumno (ID)</option>
              </select>

              {filtroTipo === "clase" && (
                <select value={filtroValor} onChange={e => setFiltroValor(e.target.value)} className="input">
                  <option value="">--Selecciona clase--</option>
                  {clases.map(c => (
                    <option key={c.idClase ?? c.IdClase} value={c.idClase ?? c.IdClase}>
                      {(c.materia ?? c.Materia)} — {(c.periodo ?? c.Periodo)}
                    </option>
                  ))}
                </select>
              )}

              {filtroTipo === "materia" && (
                <select value={filtroValor} onChange={e => setFiltroValor(e.target.value)} className="input">
                  <option value="">--Selecciona materia--</option>
                  {materias.map(m => (
                    <option key={m.idMateria ?? m.IdMateria} value={m.idMateria ?? m.IdMateria}>
                      {m.nombre ?? m.Nombre}
                    </option>
                  ))}
                </select>
              )}

              {filtroTipo === "alumno" && (
                <input className="input" placeholder="Id Alumno" value={filtroValor} onChange={e=>setFiltroValor(e.target.value)} />
              )}

              <button onClick={buscar} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>

              {/* Busca por Materia + Periodo */}
              <div className="ml-4 flex gap-2">
                <select id="mat" defaultValue="" className="input" onChange={() => {}}>
                  <option value="">--(opcional) Materia--</option>
                  {materias.map(m => <option key={m.idMateria ?? m.IdMateria} value={m.idMateria ?? m.IdMateria}>{m.nombre ?? m.Nombre}</option>)}
                </select>
                <input id="periodo" placeholder="Periodo (ej: 2025-2)" className="input" />
                <button className="bg-gray-600 text-white px-3 py-2 rounded" onClick={()=>{
                  const mid = document.getElementById('mat').value;
                  const per = document.getElementById('periodo').value;
                  buscarMateriaPeriodo(mid, per);
                }}>Buscar Materia+Periodo</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded">
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
                {califs.map(c => (
                  <tr key={c.idCalificacion}>
                    <td>{c.idCalificacion}</td>
                    <td>{c.alumnoNombre}</td>
                    <td>{c.materia}</td>
                    <td>{c.periodo}</td>
                    <td>{c.nota}</td>
                    <td>{c.fechaRegistro ? new Date(c.fechaRegistro).toLocaleString() : ""}</td>
                    <td>{c.publicado ? "Sí" : "No"}</td>
                    <td>
                      <button 
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => togglePublicar(c.idCalificacion, c.publicado)}
                      >
                        {c.publicado ? "Ocultar" : "Publicar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {califs.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4">No se encontraron calificaciones</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ASIGNAR */}
      {activeTab === "asignar" && (
        <div className="bg-white p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Asignar Calificación</h2>

          <select 
            className="input mb-4"
            value={claseSeleccionada}
            onChange={(e) => cargarAlumnosClase(e.target.value)}
          >
            <option value="">--Selecciona Clase--</option>
            {clases.map(c => (
              <option key={c.idClase ?? c.IdClase} value={c.idClase ?? c.IdClase}>
                {(c.materia ?? c.Materia)} — {(c.periodo ?? c.Periodo)}
              </option>
            ))}
          </select>

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
              {alumnosClase.map(a => (
                <tr key={a.idClaseAlumno}>
                  <td>{a.alumnoNombre}</td>
                  <td>
                    <input 
                      className="input w-24"
                      type="number"
                      value={notaPorAlumno[a.idClaseAlumno] ?? ""}
                      onChange={(e) => setNotaPorAlumno(prev => ({ ...prev, [a.idClaseAlumno]: e.target.value }))}
                    />
                  </td>

                  <td>
                    <input 
                      type="checkbox"
                      checked={!!publicadoPorAlumno[a.idClaseAlumno]}
                      onChange={(e) => setPublicadoPorAlumno(prev => ({ ...prev, [a.idClaseAlumno]: e.target.checked }))}
                    />
                  </td>

                  <td>
                    <button 
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => guardarCalificacion(a.idClaseAlumno)}
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
              {alumnosClase.length === 0 && <tr><td colSpan={4} className="text-center py-4">Selecciona una clase para ver alumnos</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
