// src/pages/login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ nombreUsuario: "", contrasena: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(form);
  

      login(response);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error login:", err);
      alert("Credenciales incorrectas o API no disponible.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

        <input
          name="nombreUsuario"
          value={form.nombreUsuario}
          onChange={handleChange}
          placeholder="Usuario"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          name="contrasena"
          type="password"
          value={form.contrasena}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
