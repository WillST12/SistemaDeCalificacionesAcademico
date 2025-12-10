// src/pages/admin/alumnos/AlumnosDesactivados.jsx
import { useEffect, useState } from "react";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function AlumnosDesactivados() {
  const [alumnos, setAlumnos] = useState([]);

  const cargar = async () => {
    try {
      const res = await alumnoService.desactivados();
      setAlumnos(res.data);
    } catch {
      alert("Error cargando alumnos desactivados");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const reactivar = async (id) => {
    if (!confirm("¿Reactivar alumno?")) return;

    try {
      await alumnoService.reactivar(id);
      alert("Alumno reactivado");
      cargar();
    } catch {
      alert("Error reactivando");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Alumnos desactivados</h1>

      <div className="bg-white p-4 rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Matrícula</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {alumnos.map((a) => (
              <tr key={a.idAlumno}>
                <td>{a.idAlumno}</td>
                <td>
                  {a.nombre} {a.apellido}
                </td>
                <td>{a.correo}</td>
                <td>{a.matricula}</td>
                <td>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => reactivar(a.idAlumno)}
                  >
                    Reactivar
                  </button>
                </td>
              </tr>
            ))}

            {alumnos.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No hay alumnos desactivados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
