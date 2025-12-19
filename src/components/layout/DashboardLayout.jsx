import { Outlet, Link, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  // Leer rol del usuario
  const saved = localStorage.getItem("user");
  const user = saved ? JSON.parse(saved) : null;
  const rol = user?.rol;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-600 text-white p-6 flex flex-col justify-between">

        {/* === PARTE SUPERIOR === */}
        <div>
          <h2 className="text-lg font-bold">Menú</h2>

          {/* GENERAL */}
          <Link to="/dashboard" className="block hover:underline mt-3">
            Inicio
          </Link>

          {/* ADMIN */}
          {rol === "Admin" && (
            <div className="mt-4">
              <h3 className="font-semibold opacity-80">Administración</h3>

              <Link to="/admin/alumnos" className="block hover:underline mt-2">
                Alumnos
              </Link>

              <Link to="/admin/profesores" className="block hover:underline">
                Profesores
              </Link>

              <Link to="/admin/materias" className="block hover:underline">
                Materias
              </Link>

              <Link to="/admin/clases" className="block hover:underline">
                Clases
              </Link>

              <Link to="/admin/calificaciones" className="block hover:underline">
                Calificaciones
              </Link>
            </div>
          )}

          {/* PROFESOR */}
          {rol === "Profesor" && (
            <div className="mt-4">
              <h3 className="font-semibold opacity-80">Profesor</h3>

              <Link to="/profesor/materias" className="block hover:underline mt-2">
                Mis Materias
              </Link>

              <Link to="/profesor/clases" className="block hover:underline">
                Mis Clases
              </Link>

              <Link to="/profesor/calificaciones" className="block hover:underline">
                Calificaciones
              </Link>
            </div>
          )}

          {/* ALUMNO Vamos a esto prox... */}
          {rol === "Alumno" && (
            <div className="mt-4">
              <h3 className="font-semibold opacity-80">Alumno</h3>

              <Link to="/alumno/clases" className="block hover:underline">
                Mis Clases
              </Link>

              <Link to="/alumno/calificaciones" className="block hover:underline">
                Mis Calificaciones
              </Link>
            </div>
          )}
        </div>

        {/* === PARTE INFERIOR === */}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>

      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
    