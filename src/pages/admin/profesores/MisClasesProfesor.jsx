import { useEffect, useState } from "react";
import ClaseService from "../../../services/ClaseService";
import { useAuth } from "../../../hooks/useAuth";
import BackButton from "../../../components/ui/BackButton";

export default function MisClasesProfesor() {
  const { user } = useAuth(); // user.idUsuario
  const [clases, setClases] = useState([]);

  useEffect(() => {
    if (!user?.idUsuario) return;

    const cargar = async () => {
      try {
        const res = await ClaseService.porUsuarioProfesor(user.idUsuario);
        setClases(res.data);
      } catch (error) {
        console.error("Error cargando clases del profesor", error);
      }
    };

    cargar();
  }, [user]);

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Mis Clases</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Periodo</th>
          </tr>
        </thead>

        <tbody>
          {clases.map((c) => (
            <tr key={c.idClase} className="border-b">
              <td className="p-3">{c.materia}</td>
              <td className="p-3">{c.periodo}</td>
            </tr>
          ))}

          {clases.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                No tienes clases asignadas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
