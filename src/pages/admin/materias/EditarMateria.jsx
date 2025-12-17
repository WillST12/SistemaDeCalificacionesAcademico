import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import materiaService from "../../../services/materiaService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarMateria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
  });

  const cargarMateria = async () => {
    try {
      const res = await materiaService.obtener(id);
      setForm({
        nombre: res.data.nombre,
        codigo: res.data.codigo,
        descripcion: res.data.descripcion ?? "",
      });
    } catch {
      alert("Error cargando materia");
      navigate("/admin/materias");
    }
  };

  useEffect(() => {
    cargarMateria();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materiaService.actualizar(id, form);
      alert("Materia actualizada");
      navigate("/admin/materias");
    } catch (err) {
      alert("Error actualizando materia");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Editar Materia</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Código
          </label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
