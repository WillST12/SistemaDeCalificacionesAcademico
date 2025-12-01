import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profesorService from "../../../services/profesorService";
import BackButton from "../../../components/ui/BackButton";

export default function EditarProfesor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });

  const cargarProfesor = async () => {
    const res = await profesorService.obtener(id);
    setForm(res.data);
  };

  useEffect(() => {
    cargarProfesor();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await profesorService.actualizar(id, form);
    alert("Profesor actualizado");
    navigate("/admin/profesores");
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Editar Profesor</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <input name="nombre" value={form.nombre} className="input" onChange={handleChange} />
        <input name="apellido" value={form.apellido} className="input" onChange={handleChange} />
        <input name="correo" value={form.correo} className="input" onChange={handleChange} />

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
