import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function AlumnosListado() {
  const [alumnos, setAlumnos] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    alumno: null
  });

  const cargarAlumnos = async () => {
    try {
      const res = await alumnoService.listar();
      setAlumnos(res.data);
    } catch {
      alert("Error cargando alumnos");
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const abrirModal = (alumno) => {
    setModal({ open: true, alumno });
  };

  const cerrarModal = () => {
    setModal({ open: false, alumno: null });
  };

  const confirmarAccion = async () => {
    try {
      if (modal.alumno.activo) {
        await alumnoService.desactivar(modal.alumno.idAlumno);
      } else {
        await alumnoService.reactivar(modal.alumno.idAlumno);
      }

      cerrarModal();
      cargarAlumnos();
    } catch {
      alert("Error actualizando alumno");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Alumnos</h1>

        <Link
          to="/admin/alumnos/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Alumno
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Matrícula</th>
            <th className="p-3">Activo</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map((a) => (
            <tr key={a.idAlumno} className="border-b">
              <td className="p-3">{a.idAlumno}</td>
              <td className="p-3">{a.nombre} {a.apellido}</td>
              <td className="p-3">{a.correo}</td>
              <td className="p-3">{a.matricula}</td>

              <td className="p-3">
                <span className={`font-semibold ${
                  a.activo ? "text-green-600" : "text-red-600"
                }`}>
                  {a.activo ? "Sí" : "No"}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/alumnos/editar/${a.idAlumno}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  onClick={() => abrirModal(a)}
                  className={`px-3 py-1 rounded text-white ${
                    a.activo ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {a.activo ? "Desactivar" : "Reactivar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <ConfirmModal
        open={modal.open}
        title={modal.alumno?.activo ? "Desactivar Alumno" : "Reactivar Alumno"}
        message={
          modal.alumno?.activo
            ? `¿Seguro que deseas desactivar a ${modal.alumno?.nombre}?`
            : `¿Deseas reactivar a ${modal.alumno?.nombre}?`
        }
        confirmText={modal.alumno?.activo ? "Desactivar" : "Reactivar"}
        danger={modal.alumno?.activo}
        onCancel={cerrarModal}
        onConfirm={confirmarAccion}
      />
    </div>
  );
}
