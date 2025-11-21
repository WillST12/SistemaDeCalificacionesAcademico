
import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerificarCodigo() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const c = query.get("correo");
    if (c) setCorreo(decodeURIComponent(c));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !codigo) return alert("Completa correo y código.");

    try {
      setLoading(true);
      await authService.verificarCodigo({ correo, codigo });
      // Si OK -> ir a nueva contraseña pasando correo y codigo en query
      navigate(`/nueva-password?correo=${encodeURIComponent(correo)}&codigo=${encodeURIComponent(codigo)}`);
    } catch (err) {
      console.error(err);
      alert("Código inválido o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-800 to-sky-400 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-sky-800">Verificar código</h2>
        <p className="text-sm text-gray-600 mb-4">Ingresa tu correo y el código que recibiste.</p>

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar código"}
        </button>
      </form>
    </div>
  );
}
