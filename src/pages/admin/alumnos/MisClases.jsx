import { useEffect, useState, useMemo } from "react";
import alumnoService from "../../../services/alumnoService";
import alumnoClasesService from "../../../services/ClaseAlumnoService";

export default function MisClases() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const clasesFiltradas = useMemo(() => {
    return clases.filter((c) =>
      `${c.materia} ${c.codigoMateria} ${c.profesor}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clases, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Mis Clases
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Total: {clasesFiltradas.length}
          </span>

          <input
            type="text"
            placeholder="Buscar clase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
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
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Cargando clases...
                </td>
              </tr>
            )}

            {!loading &&
              clasesFiltradas.map((c) => (
                <tr
                  key={c.idClaseAlumno}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {c.materia}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {c.codigoMateria}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{c.profesor}</td>
                  <td className="p-4 text-gray-600">{c.periodo}</td>
                </tr>
              ))}

            {!loading && clasesFiltradas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No se encontraron clases 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
