import { useEffect, useState } from "react";
import ClaseService from "../../../services/ClaseService";
import { useAuth } from "../../../hooks/useAuth";
import BackButton from "../../../components/ui/BackButton";

export default function MisClasesProfesor() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [cantidades, setCantidades] = useState({});

  const [claseAbierta, setClaseAbierta] = useState(null);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    if (!user?.idUsuario) return;

    const cargar = async () => {
      try {
        const res = await ClaseService.porUsuarioProfesor(user.idUsuario);
        setClases(res.data);

        const map = {};
        for (const c of res.data) {
          const alumnos = await ClaseService.alumnos(c.idClase);
          map[c.idClase] = alumnos.data.length;
        }
        setCantidades(map);
      } catch (error) {
        console.error("Error cargando clases del profesor", error);
      }
    };

    cargar();
  }, [user]);

  const verAlumnos = async (idClase) => {
    if (claseAbierta === idClase) {
      setClaseAbierta(null);
      setAlumnos([]);
      return;
    }

    try {
      const res = await ClaseService.alumnos(idClase);
      setAlumnos(res.data);
      setClaseAbierta(idClase);
    } catch (error) {
      console.error("Error cargando alumnos", error);
    }
  };

  return (
    <div className="space-y-4">
      <BackButton />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
           Mis Clases
        </h1>
        <span className="text-sm text-gray-500">
          Total: {clases.length}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Materia</th>
              <th className="p-4 text-left">Periodo</th>
              <th className="p-4 text-center">Estudiantes</th>
            </tr>
          </thead>

          <tbody>
            {clases.map((c) => (
              <tbody key={c.idClase}>
                <tr className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">
                    {c.materia}
                  </td>
                  <td className="p-4 text-gray-600">
                    {c.periodo}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => verAlumnos(c.idClase)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                        ${
                          claseAbierta === c.idClase
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {claseAbierta === c.idClase ? "Ocultar" : "Ver"} (
                      {cantidades[c.idClase] ?? 0})
                    </button>
                  </td>
                </tr>

                {/* Fila expandida */}
                {claseAbierta === c.idClase && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={3} className="p-5">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Alumnos inscritos
                      </h3>

                      {alumnos.length === 0 ? (
                        <p className="text-gray-500">
                          No hay alumnos inscritos en esta clase.
                        </p>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {alumnos.map((a) => (
                            <li
                              key={a.idAlumno}
                              className="flex justify-between bg-white px-4 py-2 rounded border"
                            >
                              <span className="font-medium text-gray-800">
                                {a.nombre} {a.apellido}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {a.matricula}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}

            {clases.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No tienes clases asignadas 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
