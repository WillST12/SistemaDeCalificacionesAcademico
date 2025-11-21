// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

// Páginas existentes
import Login from "../pages/login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "../components/auth/RequireAuth";
import CambiarContrasena from "../pages/cambiar-contrasena/CambiarContrasena";

// Nuevas páginas para recuperación
import RecuperarPassword from "../pages/password/RecuperarPassword";
import VerificarCodigo from "../pages/password/VerificarCodigo";
import NuevaPassword from "../pages/password/NuevaPassword";

export const router = createBrowserRouter([
  // ============================
  // RUTAS PÚBLICAS
  // ============================
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/recuperar-password",
    element: <RecuperarPassword />,
  },
  {
    path: "/verificar-codigo",
    element: <VerificarCodigo />,
  },
  {
    path: "/nueva-password",
    element: <NuevaPassword />,
  },

  // ============================
  // RUTA PARA CAMBIAR CONTRASEÑA POST LOGIN
  // ============================
  {
    path: "/cambiar-contrasena",
    element: <CambiarContrasena />,
  },

  // ============================
  // RUTAS PROTEGIDAS
  // ============================
  {
    path: "/dashboard",
    element: (
      <RequireAuth roles={["Admin", "Profesor", "Alumno"]}>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
]);
