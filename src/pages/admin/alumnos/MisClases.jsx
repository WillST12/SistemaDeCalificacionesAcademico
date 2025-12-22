import { useEffect, useState } from "react";
import alumnoService from "../../../services/alumnoService";
import alumnoClasesService from "../../../services/ClaseAlumnoService";

export default function MisClases() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const saved = localStorage.getItem("user");
        const user = saved ? JSON.parse(saved) : null;
        if (!user?.idUsuario) return;

        const resAlumno = await alumnoService.porUsuario(user.idUsuario);
        const idAlumno = resAlumno.data.idAlumno;

        const res = await alumnoClasesService.misClases(idAlumno);
        setClases(res.data);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Mis Clases
        </h1>
        <span className="text-sm text-gray-500">
          Total: {clases.length}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 sticky top-0">
            <tr>
              <th className="p-4 text-left">Materia</th>
              <th className="p-4 text-left">Código</th>
              <th className="p-4 text-left">Profesor</th>
              <th className="p-4 text-left">Periodo</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Cargando clases...
                </td>
              </tr>
            )}

            {!loading &&
              clases.map((c) => (
                <tr
                  key={c.idClaseAlumno}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {c.materia}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold">
                      {c.codigoMateria}
                    </span>
                  </td>
                  <td className="p-4">{c.profesor}</td>
                  <td className="p-4 text-gray-600">{c.periodo}</td>
                </tr>
              ))}

            {!loading && clases.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No estás inscrito en ninguna clase 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
