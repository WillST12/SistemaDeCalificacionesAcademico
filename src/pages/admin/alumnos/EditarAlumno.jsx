import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    matricula: "",
    fechaNac: "",
  });

  const cargarAlumno = async () => {
    try {
      const res = await alumnoService.obtener(id);
      setForm({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        correo: res.data.correo,
        matricula: res.data.matricula,
        fechaNac: res.data.fechaNac?.substring(0, 10) ?? "",
      });
    } catch {
      alert("Error cargando alumno");
      navigate("/admin/alumnos");
    }
  };

  useEffect(() => {
    cargarAlumno();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await alumnoService.actualizar(id, form);
      alert("Alumno actualizado");
      navigate("/admin/alumnos");
    } catch (err) {
      alert("Error actualizando alumno");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Editar Alumno</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
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
            Apellido
          </label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Correo
          </label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Matrícula
          </label>
          <input
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="fechaNac"
            value={form.fechaNac}
            onChange={handleChange}
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