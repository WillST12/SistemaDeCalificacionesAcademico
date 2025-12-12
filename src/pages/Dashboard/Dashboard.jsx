// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import dashboardService from "../../services/dashboardService";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        if (user.rol === "Admin") {
          const res = await dashboardService.admin();
          setData(res.data);
        }
        if (user.rol === "Profesor") {
          const res = await dashboardService.profesor(user.idUsuario);
          setData(res.data);
        }
        if (user.rol === "Alumno") {
          const res = await dashboardService.alumno(user.idUsuario);
          setData(res.data);
        }
      } catch {
        alert("Error cargando dashboard");
      }
    };
    cargar();
  }, []);

  if (!data) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard {user.rol}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {user.rol === "Admin" && (
          <>
            <Card title="Alumnos activos" value={data.alumnosActivos} />
            <Card title="Profesores activos" value={data.profesoresActivos} />
            <Card title="Clases activas" value={data.clasesActivas} />
            <Card title="Materias" value={data.materias} />
            <Card title="Calificaciones" value={data.calificaciones} />
          </>
        )}

        {user.rol === "Profesor" && (
          <>
            <Card title="Clases asignadas" value={data.totalClases} />
            <Card title="Alumnos" value={data.totalAlumnos} />
            <Card title="Calificaciones registradas" value={data.calificacionesRegistradas} />
          </>
        )}

        {user.rol === "Alumno" && (
          <>
            <Card title="Clases inscritas" value={data.clasesInscritas} />
            <Card title="Calificaciones publicadas" value={data.calificacionesPublicadas} />
          </>
        )}

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
