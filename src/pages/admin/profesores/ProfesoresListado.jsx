import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profesorService from "../../../services/profesorService";
import BackButton from "../../../components/ui/BackButton";

export default function ProfesoresListado() {
  const [profesores, setProfesores] = useState([]);

  const cargarProfesores = async () => {
    try {
      const res = await profesorService.listar();
      setProfesores(res.data);
    } catch {
      alert("Error cargando profesores");
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  const desactivarProfesor = async (id) => {
    if (!confirm("¿Seguro que deseas desactivar este profesor?")) return;
    try {
      await profesorService.desactivar(id);
      cargarProfesores();
    } catch {
      alert("Error desactivando profesor");
    }
  };

  const reactivarProfesor = async (id) => {
    if (!confirm("¿Reactivar este profesor?")) return;
    try {
      await profesorService.reactivar(id);
      cargarProfesores();
    } catch {
      alert("Error reactivando profesor");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Profesores</h1>

        <Link
          to="/admin/profesores/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Profesor
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Especialidad</th>
            <th className="p-3">Activo</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {profesores.map((p) => (
            <tr key={p.idProfesor} className="border-b">
              <td className="p-3">{p.idProfesor}</td>
              <td className="p-3">{p.nombre} {p.apellido}</td>
              <td className="p-3">{p.correo}</td>
              <td className="p-3">{p.especialidad}</td>

              {/* ACTIVO */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    p.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.activo ? "Sí" : "No"}
                </span>
              </td>

              {/* ACCIONES */}
              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/profesores/editar/${p.idProfesor}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                {p.activo ? (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => desactivarProfesor(p.idProfesor)}
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => reactivarProfesor(p.idProfesor)}
                  >
                    Reactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
