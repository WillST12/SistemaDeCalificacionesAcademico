// src/pages/cambiar-contrasena/CambiarContrasena.jsx
import { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function CambiarContrasena() {
  const [form, setForm] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await authService.cambiarContrasena({
        contrasenaActual: form.contrasenaActual,
        nuevaContrasena: form.nuevaContrasena,
      });

      login({
        ...user,
        debeCambiarContrasena: false,
      });

      alert(result.message || "Contraseña actualizada.");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Error cambiando la contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-xl shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cambiar Contraseña
        </h2>

        <input
          type="password"
          name="contrasenaActual"
          placeholder="Contraseña actual"
          value={form.contrasenaActual}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          name="nuevaContrasena"
          placeholder="Nueva contraseña"
          value={form.nuevaContrasena}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-2"
        />

        {/* Requisitos de seguridad */}
        <ul className="text-sm text-gray-600 mb-4">
          <li>• Mínimo 8 caracteres</li>
          <li>• Al menos 1 letra mayúscula</li>
          <li>• Al menos 1 número</li>
          <li>• Al menos 1 símbolo (!, @, #, $, %, etc.)</li>
        </ul>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          Actualizar
        </button>
      </form>
    </div>
  );
}
