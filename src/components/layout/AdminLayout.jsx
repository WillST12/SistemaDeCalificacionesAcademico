// src/components/layout/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Panel de Administración</h2>

        <nav className="space-y-3">

          <Link
            to="/admin"
            className="block py-2 px-3 bg-blue-600 rounded hover:bg-blue-500 transition"
          >
            Inicio
          </Link>

          <div>
            <p className="text-sm uppercase opacity-70 mb-1">Gestión</p>

            <Link
              to="/admin/alumnos"
              className="block py-2 px-3 hover:bg-blue-600 rounded transition"
            >
              Alumnos
            </Link>

            <Link
              to="/admin/profesores"
              className="block py-2 px-3 hover:bg-blue-600 rounded transition"
            >
              Profesores
            </Link>

            <Link
              to="/admin/materias"
              className="block py-2 px-3 hover:bg-blue-600 rounded transition"
            >
              Materias
            </Link>

            <Link
              to="/admin/clases"
              className="block py-2 px-3 hover:bg-blue-600 rounded transition"
            >
              Clases
            </Link>

            <Link
              to="/admin/calificaciones"
              className="block py-2 px-3 hover:bg-blue-600 rounded transition"
            >
              Calificaciones
            </Link>
          </div>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
