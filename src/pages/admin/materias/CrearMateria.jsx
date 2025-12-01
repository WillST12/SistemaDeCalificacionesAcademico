import { useState } from "react";
import materiaService from "../../../services/materiaService";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/ui/BackButton";

export default function CrearMateria() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.codigo || !form.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await materiaService.crear(form);
      alert("Materia creada correctamente");
      navigate("/admin/materias");
    } catch (error) {
      console.error(error);
      alert("Error al crear materia");
    }
  };

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Crear Materia</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <input
          name="nombre"
          placeholder="Nombre de la materia"
          className="input"
          onChange={handleChange}
        />

        <input
          name="codigo"
          placeholder="Código"
          className="input"
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="col-span-2 input"
          onChange={handleChange}
        />

        <button className="col-span-2 bg-green-600 text-white py-2 rounded-lg">
          Guardar
        </button>
      </form>
    </div>
  );
}
