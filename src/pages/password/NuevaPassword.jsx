// src/pages/password/NuevaPassword.jsx
import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NuevaPassword() {
  const query = useQuery();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");

  const [nueva, setNueva] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const c = query.get("correo") ?? "";
    const k = query.get("codigo") ?? "";
    setCorreo(decodeURIComponent(c));
    setCodigo(decodeURIComponent(k));
  }, []);

  // Reglas: min 8, 1 mayus, 1 numero, 1 simbolo
  const passwordOk = (pw) => {
    if (!pw) return false;
    const min8 = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(pw);
    return min8 && hasUpper && hasNumber && hasSymbol;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordOk(nueva)) return alert("La contraseña no cumple los requisitos.");
    if (nueva !== confirm) return alert("Las contraseñas no coinciden.");
    if (!correo || !codigo) return alert("Falta correo o código (verifica el flujo de verificación).");

    try {
      setLoading(true);
      await authService.restablecerPassword({ correo, codigo, nuevaContrasena: nueva });
      alert("Contraseña actualizada. Ahora puedes iniciar sesión.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al restablecer contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-800 to-sky-400 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-sky-800">Nueva contraseña</h2>
        <p className="text-sm text-gray-600 mb-4">
          Requisitos: mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 símbolo.
        </p>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <div className="text-sm text-gray-600 mb-3">
          <p>Estado:</p>
          <ul className="list-disc ml-5">
            <li className={nueva.length >= 8 ? "text-green-600" : ""}>Mínimo 8 caracteres</li>
            <li className={/[A-Z]/.test(nueva) ? "text-green-600" : ""}>Al menos 1 mayúscula</li>
            <li className={/[0-9]/.test(nueva) ? "text-green-600" : ""}>Al menos 1 número</li>
            <li className={/[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(nueva) ? "text-green-600" : ""}>Al menos 1 símbolo</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 rounded hover:bg-sky-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}
