import { useEffect, useState } from "react";
import profesorService from "../../../services/profesorService";
import { useAuth } from "../../../hooks/useAuth";
export default function MisMaterias() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    profesorService.materias(user.idProfesor)
      .then(r => setMaterias(r.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis Materias</h1>

      <ul className="bg-white p-4 rounded shadow">
        {materias.map(m => (
          <li key={m.idMateria}>
            {m.nombre} ({m.codigo})
          </li>
        ))}
      </ul>
    </div>
  );
}
