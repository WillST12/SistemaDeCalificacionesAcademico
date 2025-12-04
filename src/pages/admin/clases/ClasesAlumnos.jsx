import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClaseService from "../../../services/ClaseService";
import BackButton from "../../../components/ui/BackButton";

export default function ClasesAlumnos() {
  const { id } = useParams();
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await ClaseService.listarAlumnos(id);
    setAlumnos(res.data);
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Alumnos inscritos</h1>

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.idAlumno}>
              <td className="p-3">{a.idAlumno}</td>
              <td className="p-3">{a.nombre}</td>
              <td className="p-3">{a.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
