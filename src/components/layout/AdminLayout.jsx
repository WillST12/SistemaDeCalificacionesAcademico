import { Outlet, Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function AdminLayout() {
  const logout = useLogout();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Panel Admin</h2>

        <nav className="space-y-2 mt-4">

          <Link to="/dashboard" className="block hover:underline">Inicio</Link>

          <h3 className="font-semibold opacity-80 mt-4">Administración</h3>

          <Link to="/admin/alumnos" className="block hover:underline">Alumnos</Link>
          <Link to="/admin/profesores" className="block hover:underline">Profesores</Link>
          <Link to="/admin/materias" className="block hover:underline">Materias</Link>
          <Link to="/admin/clases" className="block hover:underline">Clases</Link>
          <Link to="/admin/calificaciones" className="block hover:underline">Calificaciones</Link>
        </nav>

        {/* BOTÓN CERRAR SESIÓN */}
        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </aside>
      

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
