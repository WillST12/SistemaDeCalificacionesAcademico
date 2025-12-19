import { useEffect, useState } from "react";
import alumnoClasesService from "../../../services/ClaseAlumnoService";
import alumnoService from "../../../services/alumnoService";
import { useAuth } from "../../../hooks/useAuth";

export default function MisClases() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // ✅ Sacar idUsuario del user (ajusta si tu objeto usa otro nombre)
        const idUsuario = user?.idUsuario ?? user?.IdUsuario ?? user?.id;
        if (!idUsuario) throw new Error("No existe idUsuario en user.");

        // 1) Obtener idAlumno real desde backend
        const alumnoRes = await alumnoService.porUsuario(idUsuario);
        const idAlumno = alumnoRes.data.idAlumno;

        // 2) Traer clases
        const res = await alumnoClasesService.misClases(idAlumno);
        setClases(res.data);
      } catch (e) {
        console.error(e);
        setClases([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Clases</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Código</th>
            <th className="p-3">Profesor</th>
            <th className="p-3">Periodo</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            clases.map((c) => (
              <tr key={c.idClaseAlumno} className="border-b">
                <td className="p-3">{c.materia}</td>
                <td className="p-3">{c.codigoMateria}</td>
                <td className="p-3">{c.profesor}</td>
                <td className="p-3">{c.periodo}</td>
              </tr>
            ))}

          {loading && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Cargando...
              </td>
            </tr>
          )}

          {!loading && clases.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No estás inscrito en ninguna clase
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
