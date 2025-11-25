import { Outlet, Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function AlumnoLayout() {
  const logout = useLogout();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-green-700 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Panel Alumno</h2>

        <nav className="space-y-2 mt-4">
          <Link to="/dashboard" className="block hover:underline">Inicio</Link>
          <Link to="/alumno/materias" className="block hover:underline">Materias</Link>
          <Link to="/alumno/clases" className="block hover:underline">Clases</Link>
          <Link to="/alumno/calificaciones" className="block hover:underline">Calificaciones</Link>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
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
