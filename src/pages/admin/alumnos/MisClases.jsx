import { useEffect, useState } from "react";

import alumnoService from "../../../services/alumnoService";

import alumnoClasesService from "../../../services/ClaseAlumnoService";

export default function MisClases() {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const saved = localStorage.getItem("user");
      const user = saved ? JSON.parse(saved) : null;

      if (!user?.idUsuario) return;

      // convertir idUsuario -> idAlumno
      const resAlumno = await alumnoService.porUsuario(user.idUsuario);
      const idAlumno = resAlumno.data.idAlumno;

      // traer clases del alumno
      const res = await alumnoClasesService.misClases(idAlumno);
      setClases(res.data);
    };

    cargar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Clases</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Materia</th>
            <th className="p-3">Código</th>
            <th className="p-3">Profesor</th>
            <th className="p-3">Periodo</th>
          </tr>
        </thead>

        <tbody>
          {clases.map((c) => (
            <tr key={c.idClaseAlumno} className="border-b">
              <td className="p-3">{c.materia}</td>
              <td className="p-3">{c.codigoMateria}</td>
              <td className="p-3">{c.profesor}</td>
              <td className="p-3">{c.periodo}</td>
            </tr>
          ))}

          {clases.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No estás inscrito en ninguna clase
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
