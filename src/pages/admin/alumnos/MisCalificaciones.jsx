import { useEffect, useState } from "react";
import calificacionService from "../../services/calificacionService";
import { useAuth } from "../../hooks/useAuth";

export default function MisCalificaciones() {
  const { user } = useAuth();
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      if (!user?.idAlumno) return;

      const res = await calificacionService.misCalificaciones(user.idAlumno);
      setCalificaciones(res.data);
    };

    cargar();
  }, [user]);

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
          {calificaciones.map((c) => (
            <tr key={c.idCalificacion} className="border-b">
              <td className="p-3">{c.materia}</td>
              <td className="p-3">{c.periodo}</td>
              <td className="p-3 font-bold">{c.nota}</td>
            </tr>
          ))}

          {calificaciones.length === 0 && (
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
