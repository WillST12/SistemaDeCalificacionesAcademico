// src/pages/password/RecuperarPassword.jsx
import { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoMostrado, setCodigoMostrado] = useState(null); // para mostrar el codigo devuelto por backend (simulación)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) return alert("Ingresa un correo válido.");

    try {
      setLoading(true);
      const data = await authService.solicitarRecuperacion(correo);
      // data debería contener { codigo } en la implementación del backend simulado
      setCodigoMostrado(data?.codigo ?? null);

      // redirigir a verificación (pasamos correo por query param)
      setTimeout(() => {
        navigate(`/verificar-codigo?correo=${encodeURIComponent(correo)}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Error solicitando recuperación. Verifica que la API esté arriba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-800 to-sky-400 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-sky-800">Recuperar contraseña</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ingresa tu correo para recibir un código de verificación (simulado).
        </p>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>

        {codigoMostrado && (
          <div className="mt-4 p-3 bg-gray-50 border rounded">
            <p className="text-sm text-gray-700">Código (simulado):</p>
            <pre className="font-mono text-lg text-sky-800">{codigoMostrado}</pre>
            <p className="text-xs text-gray-500 mt-1">Usa este código en la pantalla de verificación.</p>
          </div>
        )}
      </form>
    </div>
  );
}
