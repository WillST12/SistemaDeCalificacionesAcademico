import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import alumnoService from "../../../services/alumnoService";
import BackButton from "../../../components/ui/BackButton"; // ← FALTABA ESTO

export default function CrearAlumno() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreUsuario: "",
    contrasena: "",
    nombre: "",
    apellido: "",
    correo: "",
    matricula: "",
    fechaNac: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 👉 1. CREAR USUARIO (solo acepta nombreUsuario + contrasena)
      const res = await authService.registerAlumno({
        nombreUsuario: form.nombreUsuario,
        contrasena: form.contrasena,
      });

      const idUsuario = res.idUsuario;

      // 👉 validar que el backend devolvió un idUsuario correcto
      if (!idUsuario) {
        alert("Error: el backend no devolvió idUsuario.");
        return;
      }

      // 👉 2. CREAR ALUMNO (convertir fecha a ISO)
      await alumnoService.crear({
        idUsuario,
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        matricula: form.matricula,
        fechaNac: new Date(form.fechaNac).toISOString(), // ← ARREGLADO
      });

      alert("Alumno registrado exitosamente");
      navigate("/admin/alumnos");

    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data ?? "Error al registrar alumno");
    }
  };

  return (
    <div>
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Registrar Alumno</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >
        <h2 className="col-span-2 font-semibold text-blue-600">
          Cuenta de acceso
        </h2>

        <input
          name="nombreUsuario"
          placeholder="Usuario de inicio"
          className="input"
          onChange={handleChange}
        />

        <input
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          className="input"
          onChange={handleChange}
        />

        <h2 className="col-span-2 font-semibold text-blue-600 mt-4">
          Datos del Alumno
        </h2>

        <input
          name="nombre"
          placeholder="Nombre"
          className="input"
          onChange={handleChange}
        />

        <input
          name="apellido"
          placeholder="Apellido"
          className="input"
          onChange={handleChange}
        />

        <input
          name="correo"
          placeholder="Correo"
          className="input"
          onChange={handleChange}
        />

        <input
          name="matricula"
          placeholder="Matrícula"
          className="input"
          onChange={handleChange}
        />

        <input
          type="date"
          name="fechaNac"
          className="input"
          onChange={handleChange}
        />

        <button className="col-span-2 bg-green-600 text-white py-2 rounded-lg">
          Registrar Alumno
        </button>
      </form>
    </div>
  );
}
