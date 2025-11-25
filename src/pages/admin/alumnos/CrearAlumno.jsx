import { useState } from "react";
import { useNavigate } from "react-router-dom";
import alumnoService from "../../../services/alumnoService";
import { authService } from "../../../services/authService";
import BackButton from "../../../components/ui/BackButton";

export default function CrearAlumno() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombreUsuario: "",
    contrasena: "",
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
    setLoading(true);

    try {
      // 1️⃣ Crear usuario (rol Alumno = 3)
      const userRes = await authService.register({
        nombreUsuario: form.nombreUsuario,
        contrasena: form.contrasena,
        idRol: 3,
      });

      const idUsuario = userRes.data.idUsuario;

      // 2️⃣ Crear Alumno vinculado al usuario
      await alumnoService.crear({
        idUsuario,
        nombre: form.nombre,
        apellido: form.apellido,
        fechaNac: form.fechaNac,
        matricula: form.matricula,
        correo: form.correo,
      });

      alert("Alumno creado correctamente ✔");
      navigate("/admin/alumnos");
    } catch (err) {
      console.error(err);
      alert("Error al crear alumno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Registrar Alumno</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
      >
        {/* CREDENCIALES DE USUARIO */}
        <h2 className="col-span-2 text-lg font-semibold text-blue-600">Cuenta de acceso</h2>

        <input
          name="nombreUsuario"
          placeholder="Usuario de inicio"
          className="input"
          onChange={handleChange}
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          className="input"
          onChange={handleChange}
        />

        {/* DATOS PERSONALES */}
        <h2 className="col-span-2 text-lg font-semibold text-blue-600 mt-4">Datos del Alumno</h2>

        <input name="nombre" placeholder="Nombre" className="input" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" className="input" onChange={handleChange} />
        <input name="correo" placeholder="Correo" className="input" onChange={handleChange} />
        <input name="matricula" placeholder="Matrícula" className="input" onChange={handleChange} />
        <input type="date" name="fechaNac" className="input" onChange={handleChange} />

        <button
          disabled={loading}
          className="col-span-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Guardando..." : "Registrar Alumno"}
        </button>
      </form>
    </div>
  );
}
