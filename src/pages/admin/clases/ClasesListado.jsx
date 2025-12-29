import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function ClasesListado() {
  const [clases, setClases] = useState([]);

  const cargar = async () => {
    try {
      const res = await ClaseService.listar();
      setClases(res.data);
    } catch (error) {
      console.error("Error cargando clases:", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar la clase?")) return;

    try {
      await ClaseService.eliminar(id);
      cargar();
    } catch (error) {
      alert("Error eliminando la clase");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Clases</h1>
        <Link
          to="/admin/clases/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Crear Clase
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Periodo</th>
            <th className="p-3">Materia</th>
            <th className="p-3">Profesor</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clases.map((c) => {
            const id = c.idClase ?? c.IdClase;

            return (
              <tr key={id} className="border-b">
                <td className="p-3">{id}</td>
                <td className="p-3">{c.periodo ?? c.Periodo}</td>
                <td className="p-3">{c.materia ?? c.Materia}</td>
                <td className="p-3">{c.profesor ?? c.Profesor}</td>

                <td className="p-3 flex gap-2 justify-center">
                  {/* VER ALUMNOS */}
                  <Link
                    to={`/admin/clases/${id}`}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Inscripcion y Detalles
                  </Link>

                  {/* EDITAR */}
                  <Link
                    to={`/admin/clases/editar/${id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </Link>

                  {/* ELIMINAR */}
                  <button
                    onClick={() => eliminar(id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
