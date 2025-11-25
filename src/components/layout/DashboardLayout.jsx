import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  // leer rol del usuario
  const saved = localStorage.getItem("user");
  const user = saved ? JSON.parse(saved) : null;
  const rol = user?.rol; // "Admin" | "Profesor" | "Alumno"

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-4">
        <h2 className="text-lg font-bold">Menú</h2>

        {/* 🔹 Opción visible todos los roles */}
        <Link to="/dashboard" className="block hover:underline">
          Inicio
        </Link>

        {/* 🔹 SOLO ADMIN puede ver esto */}
        {rol === "Admin" && (
          <>
            <h3 className="mt-4 font-semibold opacity-80">Administración</h3>

            <Link to="/admin/alumnos" className="block hover:underline">
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
          </>
        )}

        {/* 🔹 SOLO PROFESOR */}
        {rol === "Profesor" && (
          <>
            <h3 className="mt-4 font-semibold opacity-80">Profesor</h3>

            <Link to="/profesor/materias" className="block hover:underline">
              Mis Materias
            </Link>

            <Link to="/profesor/clases" className="block hover:underline">
              Mis Clases
            </Link>

            <Link to="/profesor/calificaciones" className="block hover:underline">
              Calificaciones
            </Link>
          </>
        )}

        {/* 🔹 SOLO ALUMNO */}
        {rol === "Alumno" && (
          <>
            <h3 className="mt-4 font-semibold opacity-80">Alumno</h3>

            <Link to="/alumno/materias" className="block hover:underline">
              Materias Disponibles
            </Link>

            <Link to="/alumno/clases" className="block hover:underline">
              Mis Clases
            </Link>

            <Link to="/alumno/calificaciones" className="block hover:underline">
              Mis Calificaciones
            </Link>
          </>
        )}
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}
