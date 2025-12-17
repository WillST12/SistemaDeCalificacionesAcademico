import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profesorService from "../../../services/profesorService";
import BackButton from "../../../components/ui/BackButton";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function ProfesoresListado() {
  const [profesores, setProfesores] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    profesor: null,
    action: null
  });

  const cargarProfesores = async () => {
    try {
      const res = await profesorService.listar();
      setProfesores(res.data);
    } catch {
      alert("Error cargando profesores");
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  const abrirModal = (profesor, action) => {
    setModal({ open: true, profesor, action });
  };

  const cerrarModal = () => {
    setModal({ open: false, profesor: null, action: null });
  };

  const confirmarAccion = async () => {
    try {
      if (modal.action === "desactivar") {
        await profesorService.desactivar(modal.profesor.idProfesor);
      } else {
        await profesorService.reactivar(modal.profesor.idProfesor);
      }

      cerrarModal();
      cargarProfesores();
    } catch {
      alert("Error actualizando profesor");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Profesores</h1>

        <Link
          to="/admin/profesores/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Profesor
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Correo</th>
            <th className="p-3">Especialidad</th>
            <th className="p-3">Activo</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {profesores.map((p) => (
            <tr key={p.idProfesor} className="border-b">
              <td className="p-3">{p.idProfesor}</td>
              <td className="p-3">{p.nombre} {p.apellido}</td>
              <td className="p-3">{p.correo}</td>
              <td className="p-3">{p.especialidad}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  p.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {p.activo ? "Sí" : "No"}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/profesores/editar/${p.idProfesor}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                {p.activo ? (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => abrirModal(p, "desactivar")}
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => abrirModal(p, "reactivar")}
                  >
                    Reactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <ConfirmModal
        open={modal.open}
        title={
          modal.action === "desactivar"
            ? "Desactivar Profesor"
            : "Reactivar Profesor"
        }
        message={
          modal.action === "desactivar"
            ? `¿Seguro que deseas desactivar a ${modal.profesor?.nombre}?`
            : `¿Deseas reactivar a ${modal.profesor?.nombre}?`
        }
        confirmText={
          modal.action === "desactivar" ? "Desactivar" : "Reactivar"
        }
        danger={modal.action === "desactivar"}
        onCancel={cerrarModal}
        onConfirm={confirmarAccion}
      />
    </div>
  );
}
