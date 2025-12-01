import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import BackButton from "../../../components/ui/BackButton";

export default function CrearProfesor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreUsuario: "",
    contrasena: "",
    nombre: "",
    apellido: "",
    correo: "",
    especialidad: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.registerProfesor({
        nombreUsuario: form.nombreUsuario,
        contrasena: form.contrasena,
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        especialidad: form.especialidad,
      });

      alert("Profesor registrado correctamente");
      navigate("/admin/profesores");
    } catch (err) {
      console.error(err);
      alert("Error registrando profesor");
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Registrar Profesor</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <h2 className="col-span-2 font-semibold text-blue-600">
          Datos de acceso
        </h2>

        <input name="nombreUsuario" placeholder="Usuario" className="input" onChange={handleChange} />
        <input name="contrasena" type="password" placeholder="Contraseña" className="input" onChange={handleChange} />

        <h2 className="col-span-2 font-semibold text-blue-600 mt-4">
          Datos del profesor
        </h2>

        <input name="nombre" placeholder="Nombre" className="input" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" className="input" onChange={handleChange} />
        <input name="correo" placeholder="Correo" className="input" onChange={handleChange} />
        <input name="especialidad" placeholder="Especialidad" className="input" onChange={handleChange} />

        <button className="col-span-2 bg-green-600 text-white py-2 rounded-lg">
          Registrar Profesor
        </button>
      </form>
    </div>
  );
}
