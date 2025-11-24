import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/axiosConfig";



export default function AlumnosListado() {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    api.get("/alumnos").then((res) => setAlumnos(res.data));
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este alumno?")) return;

    await api.delete(`/alumnos/${id}`);
    setAlumnos(alumnos.filter((a) => a.idAlumno !== id));
  };

  return (
    <div>
      <h1>Alumnos</h1>

      <Link to="crear" className="btn btn-primary mb-3">
        + Crear Alumno
      </Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.idAlumno}>
              <td>{a.matricula}</td>
              <td>
                {a.nombre} {a.apellido}
              </td>
              <td>{a.correo}</td>
              <td>
                <Link to={`editar/${a.idAlumno}`} className="btn btn-warning btn-sm me-2">
                  Editar
                </Link>

                <button
                  onClick={() => eliminar(a.idAlumno)}
                  className="btn btn-danger btn-sm"
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
