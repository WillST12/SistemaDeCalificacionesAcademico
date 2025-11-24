// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

// RUTAS EXISTENTES
import Login from "../pages/login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "../components/auth/RequireAuth";
import CambiarContrasena from "../pages/cambiar-contrasena/CambiarContrasena";

// Recuperación de contraseña
import RecuperarPassword from "../pages/password/RecuperarPassword";
import VerificarCodigo from "../pages/password/VerificarCodigo";
import NuevaPassword from "../pages/password/NuevaPassword";

// ADMIN – Alumnos
import AdminLayout from "../components/layout/AdminLayout";
import AlumnosListado from "../pages/admin/alumnos/AlumnosListado";
import CrearAlumno from "../pages/admin/alumnos/CrearAlumno";
import EditarAlumno from "../pages/admin/alumnos/EditarAlumno";

// PROFESOR / ALUMNO (layouts)
import ProfesorLayout from "../components/layout/ProfesorLayout";
import AlumnoLayout from "../components/layout/AlumnoLayout";

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
  // CAMBIAR CONTRASEÑA (POST LOGIN)
  // ============================
  {
    path: "/cambiar-contrasena",
    element: (
      <RequireAuth roles={["Admin", "Profesor", "Alumno"]}>
        <CambiarContrasena />
      </RequireAuth>
    ),
  },

  // ============================
  // DASHBOARD GENERAL (CUALQUIER ROL)
  // ============================
  {
    path: "/dashboard",
    element: (
      <RequireAuth roles={["Admin", "Profesor", "Alumno"]}>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [{ index: true, element: <Dashboard /> }],
  },

  // ============================
  // ADMIN (CRUD COMPLETO)
  // ============================
  {
    path: "/admin",
    element: (
      <RequireAuth roles={["Admin"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      // CRUD ALUMNOS
      { path: "alumnos", element: <AlumnosListado /> },
      { path: "alumnos/crear", element: <CrearAlumno /> },
      { path: "alumnos/editar/:id", element: <EditarAlumno /> },

      // Aquí luego agregamos profesores, materias, clases, calificaciones…
    ],
  },

  // ============================
  // PROFESOR
  // ============================
  {
    path: "/profesor",
    element: (
      <RequireAuth roles={["Profesor"]}>
        <ProfesorLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      // módulos del profesor próximamente
    ],
  },

  // ============================
  // ALUMNO
  // ============================
  {
    path: "/alumno",
    element: (
      <RequireAuth roles={["Alumno"]}>
        <AlumnoLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      // módulos del alumno próximamente
    ],
  },
]);
