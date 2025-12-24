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
  const [loading, setLoading] = useState(true);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);

  useEffect(() => {
    if (!user?.idUsuario) return;

    const cargar = async () => {
      setLoading(true);
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
        alert("Error cargando tus clases");
      } finally {
        setLoading(false);
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

    setLoadingAlumnos(true);
    try {
      const res = await ClaseService.alumnos(idClase);
      setAlumnos(res.data);
      setClaseAbierta(idClase);
    } catch (error) {
      console.error("Error cargando alumnos", error);
      alert("Error cargando los alumnos");
    } finally {
      setLoadingAlumnos(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando tus clases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Mis Clases
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona y visualiza tus clases asignadas
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {clases.length} {clases.length === 1 ? 'clase' : 'clases'} activas
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              {Object.values(cantidades).reduce((a, b) => a + b, 0)} estudiantes totales
            </span>
          </div>
        </div>

        {/* Clases Cards */}
        {clases.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No tienes clases asignadas
            </h2>
            <p className="text-gray-500">
              Contacta al administrador para que te asigne clases
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clases.map((c) => (
              <div
                key={c.idClase}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">
                        {c.materia}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        📅 {c.periodo}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 rounded-full p-2">
                        <span className="text-blue-600 font-bold text-lg">
                          {cantidades[c.idClase] ?? 0}
                        </span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        Estudiantes
                      </span>
                    </div>
                    
                    <button
                      onClick={() => verAlumnos(c.idClase)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        claseAbierta === c.idClase
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {claseAbierta === c.idClase ? "🔼 Ocultar" : "👥 Ver"}
                    </button>
                  </div>

                  {/* Lista de Alumnos Expandida */}
                  {claseAbierta === c.idClase && (
                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>📋</span> Alumnos Inscritos
                      </h4>
                      
                      {loadingAlumnos ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      ) : alumnos.length === 0 ? (
                        <p className="text-gray-400 text-center py-4 text-sm">
                          No hay alumnos inscritos aún
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {alumnos.map((a, index) => (
                            <div
                              key={a.idAlumno}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                {a.nombre?.charAt(0)}{a.apellido?.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {a.nombre} {a.apellido}
                                </p>
                                <p className="text-xs text-gray-500">
                                  📝 {a.matricula}
                                </p>
                              </div>
                              <span className="text-xs font-medium text-gray-400">
                                #{index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}