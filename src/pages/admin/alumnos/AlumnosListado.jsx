// src/pages/admin/alumnos/AlumnosListado.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function AlumnosListado() {
  const [alumnos, setAlumnos] = useState([]);

  const cargarAlumnos = async () => {
    try {
      const res = await alumnoService.listar();
      setAlumnos(res.data);
    } catch {
      alert("Error cargando alumnos");
    }
  };

  const toggleActivo = async (alumno) => {
    const confirmar = confirm(
      alumno.activo
        ? "¿Deseas desactivar este alumno?"
        : "¿Deseas reactivar este alumno?"
    );

    if (!confirmar) return;

    try {
      if (alumno.activo) {
        await alumnoService.desactivar(alumno.idAlumno);
      } else {
        await alumnoService.reactivar(alumno.idAlumno);
      }
      cargarAlumnos();
    } catch {
      alert("Error actualizando estado del alumno");
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Alumnos</h1>

        <Link
          to="/admin/alumnos/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Alumno
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Matrícula</th>
            <th className="p-3">Activo</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map((a) => (
            <tr key={a.idAlumno} className="border-b">
              <td className="p-3">{a.idAlumno}</td>
              <td className="p-3">{a.nombre} {a.apellido}</td>
              <td className="p-3">{a.correo}</td>
              <td className="p-3">{a.matricula}</td>

              <td className="p-3">
                {a.activo ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/alumnos/editar/${a.idAlumno}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  onClick={() => toggleActivo(a)}
                  className={`px-3 py-1 rounded text-white ${
                    a.activo ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {a.activo ? "Desactivar" : "Reactivar"}
                </button>
              </td>
            </tr>
          ))}

          {alumnos.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No hay alumnos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
