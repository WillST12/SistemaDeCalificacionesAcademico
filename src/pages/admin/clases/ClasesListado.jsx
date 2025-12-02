import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function ClasesListado(){
  const [clases, setClases] = useState([]);

  const cargar = async () => {
    const res = await ClaseService.listar();
    setClases(res.data);
  };

  useEffect(()=>{ cargar(); }, []);

  const eliminar = async (id) => {
    if(!confirm("Eliminar clase?")) return;
    await ClaseService.eliminar(id);
    cargar();
  };

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Clases</h1>
        <Link to="/admin/clases/crear" className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Crear Clase</Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Periodo</th>
            <th className="p-3">Materia</th>
            <th className="p-3">Profesor</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clases.map(c => (
            <tr key={c.idClase ?? c.IdClase} className="border-b">
              <td className="p-3">{c.idClase ?? c.IdClase}</td>
              <td className="p-3">{c.periodo ?? c.Periodo}</td>
              <td className="p-3">{c.materia ?? c.Materia}</td>
              <td className="p-3">{c.profesor ?? c.Profesor}</td>
              <td className="p-3 flex gap-2">
                <Link to={`/admin/clases/editar/${c.idClase ?? c.IdClase}`} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</Link>
                <button onClick={()=> eliminar(c.idClase ?? c.IdClase)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
