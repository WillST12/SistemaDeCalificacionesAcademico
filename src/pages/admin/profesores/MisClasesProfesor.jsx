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
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Clases</h1>
        <span className="text-sm text-gray-600">
          Total: {clases.length}
        </span>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Periodo</th>
            <th className="p-3">Estudiantes</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clases.map((c) => (
            <>
              <tr key={c.idClase} className="border-b">
                <td className="p-3 font-medium">{c.materia}</td>
                <td className="p-3">{c.periodo}</td>
                <td className="p-3 text-center">
                  <span className="font-semibold text-blue-600">
                    {cantidades[c.idClase] ?? 0}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => verAlumnos(c.idClase)}
                    className={`px-3 py-1 rounded text-white ${
                      claseAbierta === c.idClase
                        ? "bg-gray-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {claseAbierta === c.idClase ? "Ocultar" : "Ver Alumnos"}
                  </button>
                </td>
              </tr>

              {/* Fila expandida con alumnos */}
              {claseAbierta === c.idClase && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Alumnos inscritos:
                    </h3>

                    {alumnos.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No hay alumnos inscritos en esta clase.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {alumnos.map((a) => (
                          <div
                            key={a.idAlumno}
                            className="flex justify-between bg-white px-4 py-2 rounded border"
                          >
                            <span className="font-medium text-gray-800">
                              {a.nombre} {a.apellido}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {a.matricula}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}

          {clases.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No tienes clases asignadas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}