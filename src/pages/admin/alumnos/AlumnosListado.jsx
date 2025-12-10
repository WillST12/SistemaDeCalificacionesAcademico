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

  const eliminarAlumno = async (id) => {
    if (!confirm("¿Seguro que deseas desactivar este alumno?")) return;
    try {
      await alumnoService.eliminar(id);
      cargarAlumnos();
    } catch {
      alert("Error desactivando alumno");
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

        <div className="flex gap-2">
          <Link
            to="/admin/alumnos/desactivados"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Ver desactivados
          </Link>

          <Link
            to="/admin/alumnos/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Nuevo Alumno
          </Link>
        </div>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Matrícula</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map((a) => (
            <tr key={a.idAlumno} className="border-b">
              <td className="p-3">{a.idAlumno}</td>
              <td className="p-3">
                {a.nombre} {a.apellido}
              </td>
              <td className="p-3">{a.correo}</td>
              <td className="p-3">{a.matricula}</td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/alumnos/editar/${a.idAlumno}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => eliminarAlumno(a.idAlumno)}
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
