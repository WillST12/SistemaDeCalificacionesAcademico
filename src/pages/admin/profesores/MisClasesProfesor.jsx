import { useEffect, useState } from "react";
import ClaseService from "../../../services/ClaseService";
import { useAuth } from "../../../hooks/useAuth";
import BackButton from "../../../components/ui/BackButton";

export default function MisClasesProfesor() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);

  useEffect(() => {
    ClaseService.porProfesor(user.idProfesor)
      .then((r) => setClases(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Mis Clases</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Periodo</th>
          </tr>
        </thead>
        <tbody>
          {clases.map((c) => (
            <tr key={c.idClase}>
              <td>{c.materia}</td>
              <td>{c.periodo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
