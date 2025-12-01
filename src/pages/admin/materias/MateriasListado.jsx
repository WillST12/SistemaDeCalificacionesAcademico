import { useEffect, useState } from "react";
import materiaService from "../../../services/materiaService";
import { Link } from "react-router-dom";
import BackButton from "../../../components/ui/BackButton";

export default function MateriasListado() {
  const [materias, setMaterias] = useState([]);

  const cargar = async () => {
    const res = await materiaService.listar();
    setMaterias(res.data);
  };

  const desactivar = async (id) => {
    if (!confirm("¿Desactivar materia?")) return;
    await materiaService.desactivar(id);
    cargar();
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <BackButton />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Materias</h1>

        <Link
          to="/admin/materias/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Crear Materia
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Código</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((m) => (
            <tr key={m.idMateria} className="border-b">
              <td className="p-3">{m.idMateria}</td>
              <td className="p-3">{m.nombre}</td>
              <td className="p-3">{m.codigo}</td>
              <td className="p-3">{m.activo ? "Activo" : "Inactivo"}</td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/materias/editar/${m.idMateria}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => desactivar(m.idMateria)}
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
