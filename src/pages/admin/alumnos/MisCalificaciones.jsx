import { useEffect, useState } from "react";
import alumnoService from "../../../services/alumnoService";
import calificacionService from "../../../services/calificacionService";
export default function MisCalificaciones() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      // 1) user desde localStorage (tu app lo usa así)
      const saved = localStorage.getItem("user");
      const user = saved ? JSON.parse(saved) : null;

      if (!user?.idUsuario) return;

      // 2) convertir idUsuario -> idAlumno
      const resAlumno = await alumnoService.porUsuario(user.idUsuario);
      const idAlumno = resAlumno.data.idAlumno;

      // 3) buscar calificaciones publicadas del alumno
      const res = await calificacionService.misCalificaciones(idAlumno);
      setItems(res.data);
    };

    cargar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Calificaciones</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Periodo</th>
            <th className="p-3">Nota</th>
          </tr>
        </thead>

        <tbody>
          {items.map((c) => (
            <tr key={c.idCalificacion} className="border-b">
              <td className="p-3">{c.materia}</td>
              <td className="p-3">{c.periodo}</td>
              <td className="p-3 font-semibold">{c.nota}</td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                No hay calificaciones publicadas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
