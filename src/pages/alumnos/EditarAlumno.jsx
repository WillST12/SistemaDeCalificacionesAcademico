import { useEffect, useState } from "react";
import { alumnosService } from "../../services/alumnosService";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNac: "",
    matricula: "",
    correo: "",
  });

  useEffect(() => {
    const cargar = async () => {
      const res = await alumnosService.obtenerPorId(id);
      setForm(res.data);
    };
    cargar();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await alumnosService.editar(id, form);
    navigate("/alumnos");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Alumno</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}

        <button className="bg-yellow-600 text-white px-4 py-2 rounded">
          Actualizar
        </button>
      </form>
    </div>
  );
}
