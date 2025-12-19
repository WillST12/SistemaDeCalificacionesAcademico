// src/components/layout/AlumnoLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AlumnoLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold">Panel Alumno</h2>

          <Link to="/dashboard" className="block hover:underline mt-3">
            Inicio
          </Link>

          <Link to="/alumno/clases" className="block hover:underline mt-3">
            Clases
          </Link>

          <Link to="/alumno/calificaciones" className="block hover:underline mt-2">
            Calificaciones
          </Link>
        </div>

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
