// src/pages/alumnos/AlumnosList.jsx
import { useEffect, useState } from "react";
import { alumnosService } from "../../services/alumnosService";
import { useNavigate } from "react-router-dom";

export default function AlumnosList() {
  const [alumnos, setAlumnos] = useState([]);
  const navigate = useNavigate();

  const cargarDatos = async () => {
    const res = await alumnosService.listar();
    setAlumnos(res.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alumnos</h1>

        <button
          onClick={() => navigate("/alumnos/crear")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Alumno
        </button>
      </div>

      <table className="w-full border shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Apellido</th>
            <th className="p-3 border">Matrícula</th>
            <th className="p-3 border">Correo</th>
            <th className="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.idAlumno}>
              <td className="p-3 border">{a.nombre}</td>
              <td className="p-3 border">{a.apellido}</td>
              <td className="p-3 border">{a.matricula}</td>
              <td className="p-3 border">{a.correo}</td>
              <td className="p-3 border">
                <button
                  onClick={() => navigate(`/alumnos/editar/${a.idAlumno}`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Editar
                </button>

                <button
                  onClick={async () => {
                    if (confirm("¿Eliminar alumno?")) {
                      await alumnosService.eliminar(a.idAlumno);
                      cargarDatos();
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
