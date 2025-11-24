import { useState } from "react";
import { alumnosService } from "../../services/alumnosService";
import { useNavigate } from "react-router-dom";

export default function CrearAlumno() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNac: "",
    matricula: "",
    correo: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await alumnosService.crear(form);
    navigate("/alumnos");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Alumno</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
