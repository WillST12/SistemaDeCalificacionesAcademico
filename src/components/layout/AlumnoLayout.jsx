export default function AlumnoLayout({ children }) {
  return (
    <div className="p-6">

      {/* HEADER */}
      <header className="bg-blue-600 text-white p-4 rounded shadow mb-4">
        <h1 className="text-xl font-semibold">Panel del Alumno</h1>
        <p className="text-sm opacity-80">Probando el layout funciona ✔️</p>
      </header>

      {/* CONTENIDO */}
      <main>
        {children}
      </main>
    </div>
  );
}
