// src/pages/login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({
    identificador: "", // usuario (admin) o correo (alumno/profesor)
    contrasena: ""
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await authService.login({
        identificador: form.identificador,
        contrasena: form.contrasena
      });

      login({
        token: data.token,
        rol: data.rol,
        idUsuario: data.idUsuario,
        debeCambiarContrasena: data.debeCambiarContrasena,
        identificador: form.identificador
      });

      navigate(
        data.debeCambiarContrasena
          ? "/cambiar-contrasena"
          : "/dashboard"
      );

    } catch (error) {
      alert("Credenciales incorrectas. Verifica tus datos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-blue-100">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sistema LogicOne
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* IDENTIFICADOR */}
          <div>
            <label className="text-gray-600 font-medium">
              Usuario o Correo
            </label>
            <input
              name="identificador"
              value={form.identificador}
              onChange={handleChange}
              placeholder="usuario_admin o correo@dominio.com"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="text-gray-600 font-medium">
              Contraseña
            </label>
            <input
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg 
                             hover:bg-blue-700 transition font-semibold">
            Iniciar Sesión
          </button>

        </form>

        <div className="text-center mt-4">
          <Link
            to="/recuperar-password"
            className="text-blue-600 hover:underline text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

      </div>
    </div>
  );
}
