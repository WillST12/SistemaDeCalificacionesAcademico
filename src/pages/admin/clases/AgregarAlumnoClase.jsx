import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function AgregarAlumnoClase() {
  const { id } = useParams();
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await alumnoService.listar();
    setAlumnos(res.data);
  };

  const agregar = async (idAlumno) => {
    if (!confirm("¿Agregar alumno a esta clase?")) return;

    await ClaseService.agregarAlumno(id, idAlumno);
    alert("Alumno agregado a la clase");
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Agregar alumnos a la clase</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.idAlumno}>
              <td className="p-3">{a.nombre}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">
                <button
                  onClick={() => agregar(a.idAlumno)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Agregar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
