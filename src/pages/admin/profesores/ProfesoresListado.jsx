import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profesorService from "../../../services/profesorService";
import BackButton from "../../../components/ui/BackButton";

export default function ProfesoresListado() {
  const [profesores, setProfesores] = useState([]);

  const cargarProfesores = async () => {
    const res = await profesorService.listar();
    setProfesores(res.data);
  };

  const desactivarProfesor = async (id) => {
    if (!confirm("¿Seguro que deseas desactivar este profesor?")) return;
    await profesorService.desactivar(id);
    cargarProfesores();
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

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
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {profesores.map((p) => (
            <tr key={p.idProfesor} className="border-b">
              <td className="p-3">{p.idProfesor}</td>
              <td className="p-3">{p.nombre} {p.apellido}</td>
              <td className="p-3">{p.correo}</td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/profesores/editar/${p.idProfesor}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => desactivarProfesor(p.idProfesor)}
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
