import { useEffect, useState, useMemo } from "react";
import alumnoService from "../../../services/alumnoService";
import calificacionService from "../../../services/calificacionService";

export default function MisCalificaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const notaColor = (nota) => {
    if (nota >= 90) return "bg-green-100 text-green-700";
    if (nota >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  useEffect(() => {
    const cargar = async () => {
      try {
        const saved = localStorage.getItem("user");
        const user = saved ? JSON.parse(saved) : null;
        if (!user?.idUsuario) return;

        const resAlumno = await alumnoService.porUsuario(user.idUsuario);
        const idAlumno = resAlumno.data.idAlumno;

        const res = await calificacionService.misCalificaciones(idAlumno);
        setItems(res.data);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const itemsFiltrados = useMemo(() => {
    return items.filter((c) =>
      c.materia.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const promedio = useMemo(() => {
    if (items.length === 0) return 0;
    return (
      items.reduce((acc, i) => acc + i.nota, 0) / items.length
    ).toFixed(1);
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          📝 Mis Calificaciones
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Promedio: <strong>{promedio}</strong>
          </span>

          <input
            type="text"
            placeholder="Buscar materia..."
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
              <th className="p-4 text-left">Periodo</th>
              <th className="p-4 text-center">Nota</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  Cargando calificaciones...
                </td>
              </tr>
            )}

            {!loading &&
              itemsFiltrados.map((c) => (
                <tr
                  key={c.idCalificacion}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {c.materia}
                  </td>
                  <td className="p-4 text-gray-600">{c.periodo}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-4 py-1 rounded-full font-bold text-sm ${notaColor(
                        c.nota
                      )}`}
                    >
                      {c.nota}
                    </span>
                  </td>
                </tr>
              ))}

            {!loading && itemsFiltrados.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No hay calificaciones publicadas 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
