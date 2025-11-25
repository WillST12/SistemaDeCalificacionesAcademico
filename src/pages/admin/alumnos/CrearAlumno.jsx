import { useState } from "react";
import { useNavigate } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";

export default function CrearAlumno() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNac: "",
    matricula: "",
    correo: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await alumnoService.crear(form);
    navigate("/admin/alumnos");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Alumno</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">

        <input name="nombre" placeholder="Nombre" className="input" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" className="input" onChange={handleChange} />
        <input name="correo" placeholder="Correo" className="input" onChange={handleChange} />
        <input name="matricula" placeholder="Matrícula" className="input" onChange={handleChange} />
        <input type="date" name="fechaNac" className="input" onChange={handleChange} />

        <button className="col-span-2 bg-green-600 text-white py-2 rounded-lg">
          Guardar
        </button>
      </form>
    </div>
  );
}
