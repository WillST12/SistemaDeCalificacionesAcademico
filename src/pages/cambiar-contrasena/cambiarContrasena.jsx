import { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function CambiarContrasena() {
  const [form, setForm] = useState({
    contrasenaActual: "",
    nuevaContrasena: ""
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await authService.cambiarContrasena(form);

      // Actualizar estado del usuario (debeCambiarContrasena = false)
      login({
        ...user,
        debeCambiarContrasena: false
      });

      alert(result.message || "Contraseña actualizada.");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error cambiando la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Cambiar Contraseña</h2>

        <input
          type="password"
          name="contrasenaActual"
          placeholder="Contraseña actual"
          value={form.contrasenaActual}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="password"
          name="nuevaContrasena"
          placeholder="Nueva contraseña"
          value={form.nuevaContrasena}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Actualizar
        </button>
      </form>
    </div>
  );
}
