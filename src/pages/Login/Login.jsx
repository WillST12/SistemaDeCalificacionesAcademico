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
      const data = await authService.login(form);

      login({
        token: data.token,
        rol: data.rol,
        debeCambiarContrasena: data.debeCambiarContrasena,
        nombreUsuario: form.nombreUsuario,
      });

      navigate(data.debeCambiarContrasena ? "/cambiar-contrasena" : "/dashboard");

    } catch (error) {
      alert("Credenciales incorrectas. Verifica tu usuario o contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-blue-100">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Calificaciones LogicOne
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-gray-600 font-medium">Usuario</label>
            <input
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-600 font-medium">Contraseña</label>
            <input
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
            Iniciar Sesión
          </button>

        </form>

        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => alert("Pronto implementamos recuperación de contraseña")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

      </div>
    </div>
  );
}
