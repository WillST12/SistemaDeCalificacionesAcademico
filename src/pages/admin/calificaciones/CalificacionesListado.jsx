// src/pages/admin/calificaciones/CalificacionesListado.jsx
import { useEffect, useState } from "react";
import calificacionService from "../../../services/calificacionService";
import materiaService from "../../../services/materiaService";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function CalificacionesListado() {
  const [califs, setCalifs] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("clase");
  const [filtroValor, setFiltroValor] = useState("");
  const [materias, setMaterias] = useState([]);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    materiaService.listar().then(r => setMaterias(r.data)).catch(() => {});
    ClaseService.listar().then(r => setClases(r.data)).catch(() => {});
  }, []);

  const buscar = async () => {
    try {
      let res;

      if (filtroTipo === "clase") {
        res = await calificacionService.porClase(filtroValor);
      } else if (filtroTipo === "materia") {
        res = await calificacionService.porMateria(filtroValor);
      } else if (filtroTipo === "alumno") {
        res = await calificacionService.porAlumno(filtroValor);
      }

      setCalifs(res.data);
    } catch (err) {
      console.error(err);
      alert("Error consultando calificaciones");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Calificaciones</h1>

      {/* FILTRO */}
      <div className="bg-white p-4 rounded mb-4">
        <div className="flex gap-2 items-center">

          {/* Tipo de filtro */}
          <select
            value={filtroTipo}
            onChange={e => { setFiltroTipo(e.target.value); setFiltroValor(""); }}
            className="input"
          >
            <option value="clase">Por Clase</option>
            <option value="materia">Por Materia</option>
            <option value="alumno">Por Alumno (ID)</option>
          </select>

          {/* Filtro por clase */}
          {filtroTipo === "clase" && (
            <select
              value={filtroValor}
              onChange={e => setFiltroValor(e.target.value)}
              className="input"
            >
              <option value="">--Selecciona clase--</option>
              {clases.map(c => {
                const id = c.idClase ?? c.IdClase;
                return (
                  <option key={id} value={id}>
                    {(c.materia ?? c.Materia) + " — " + (c.periodo ?? c.Periodo)}
                  </option>
                );
              })}
            </select>
          )}

          {/* Filtro por materia */}
          {filtroTipo === "materia" && (
            <select
              value={filtroValor}
              onChange={e => setFiltroValor(e.target.value)}
              className="input"
            >
              <option value="">--Selecciona materia--</option>
              {materias.map(m => (
                <option key={m.idMateria ?? m.IdMateria} value={m.idMateria ?? m.IdMateria}>
                  {m.nombre ?? m.Nombre}
                </option>
              ))}
            </select>
          )}

          {/* Filtro por alumno */}
          {filtroTipo === "alumno" && (
            <input
              className="input"
              placeholder="Id Alumno"
              value={filtroValor}
              onChange={e => setFiltroValor(e.target.value)}
            />
          )}

          <button
            onClick={buscar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* TABLA */}
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
            </tr>
          </thead>

          <tbody>
            {califs.map(c => {
              const id = c.IdCalificacion ?? c.idCalificacion;

              return (
                <tr key={id}>
                  <td>{id}</td>

                  {/* Alumno con fallback correcto */}
                  <td>{c.AlumnoNombre ?? `${c.Alumno ?? "Sin nombre"}`}</td>

                  <td>{c.Materia ?? "—"}</td>
                  <td>{c.Periodo ?? "—"}</td>

                  <td>{c.Nota ?? c.nota}</td>

                  <td>
                    {new Date(c.FechaRegistro ?? c.fechaRegistro).toLocaleString()}
                  </td>

                  <td>{(c.Publicado ?? c.publicado) ? "Sí" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
