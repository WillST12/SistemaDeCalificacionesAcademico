import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR TEMPORAL */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-lg font-bold">Menú</h2>
        <p className="text-sm opacity-80 mt-2">Layout funcionando ✔️</p>

        <ul className="mt-4 space-y-2">
          <li>
            <Link to="/admin/alumnos" className="menu-link">
              Alumnos
            </Link>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
