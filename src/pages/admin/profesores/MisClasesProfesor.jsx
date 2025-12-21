import { useEffect, useState } from "react";
import ClaseService from "../../../services/ClaseService";
import { useAuth } from "../../../hooks/useAuth";
import BackButton from "../../../components/ui/BackButton";

export default function MisClasesProfesor() {
  const { user } = useAuth(); // user.idUsuario
  const [clases, setClases] = useState([]);
  const [cantidades, setCantidades] = useState({});
  
  // 👇 NUEVO: estado para controlar qué clase está abierta
  const [claseAbierta, setClaseAbierta] = useState(null);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    if (!user?.idUsuario) return;

    const cargar = async () => {
      try {
        const res = await ClaseService.porUsuarioProfesor(user.idUsuario);
        setClases(res.data);

        // 🔹 cargar cantidad de alumnos por clase
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

  // 👇 NUEVO: función para ver/ocultar alumnos
  const verAlumnos = async (idClase) => {
    if (claseAbierta === idClase) {
      // cerrar si ya está abierta
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
      <h1 className="text-2xl font-bold mb-6">Mis Clases</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Periodo</th>
            <th className="p-3 text-center">Estudiantes</th>
          </tr>
        </thead>

        <tbody>
          {clases.map((c) => (
            <>
              <tr key={c.idClase} className="border-b">
                <td className="p-3">{c.materia}</td>
                <td className="p-3">{c.periodo}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => verAlumnos(c.idClase)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Ver ({cantidades[c.idClase] ?? 0})
                  </button>
                </td>
              </tr>

              {/* 👇 FILA EXPANDIDA: muestra alumnos cuando está abierta */}
              {claseAbierta === c.idClase && (
                <tr className="bg-gray-50">
                  <td colSpan={3} className="p-4">
                    <h3 className="font-semibold mb-2">Alumnos inscritos</h3>
                    {alumnos.length === 0 ? (
                      <p className="text-gray-500">No hay alumnos inscritos</p>
                    ) : (
                      <ul className="list-disc pl-6">
                        {alumnos.map((a) => (
                          <li key={a.idAlumno}>
                            {a.nombre} {a.apellido} — {a.matricula}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}

          {clases.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No tienes clases asignadas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}