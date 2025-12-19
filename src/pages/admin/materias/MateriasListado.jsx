// src/pages/admin/materias/MateriasListado.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import materiaService from "../../../services/materiaService";
import BackButton from "../../../components/ui/BackButton";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function MateriasListado() {
  const [materias, setMaterias] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    materia: null
  });

  const cargar = async () => {
    try {
      const res = await materiaService.listar();
      setMaterias(res.data);
    } catch {
      alert("Error cargando materias");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirModal = (materia) => {
    setModal({ open: true, materia });
  };

  const cerrarModal = () => {
    setModal({ open: false, materia: null });
  };

  const confirmarAccion = async () => {
    try {
      if (modal.materia.activo) {
        await materiaService.desactivar(modal.materia.idMateria);
      } else {
        await materiaService.reactivar(modal.materia.idMateria);
      }

      cerrarModal();
      cargar();
    } catch {
      alert("Error actualizando materia");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Materias</h1>

        <Link
          to="/admin/materias/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Crear Materia
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Código</th>
            <th className="p-3">Activo</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((m) => (
            <tr key={m.idMateria} className="border-b">
              <td className="p-3">{m.idMateria}</td>
              <td className="p-3">{m.nombre}</td>
              <td className="p-3">{m.codigo}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  m.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {m.activo ? "Sí" : "No"}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/materias/editar/${m.idMateria}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  onClick={() => abrirModal(m)}
                  className={`px-3 py-1 rounded text-white ${
                    m.activo ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {m.activo ? "Desactivar" : "Reactivar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        open={modal.open}
        title={modal.materia?.activo ? "Desactivar Materia" : "Reactivar Materia"}
        message={
          modal.materia?.activo
            ? `¿Seguro que deseas desactivar ${modal.materia?.nombre}?`
            : `¿Deseas reactivar ${modal.materia?.nombre}?`
        }
        confirmText={modal.materia?.activo ? "Desactivar" : "Reactivar"}
        danger={modal.materia?.activo}
        onCancel={cerrarModal}
        onConfirm={confirmarAccion}
      />
    </div>
  );
}
