// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

// Rutas públicas
import Login from "../pages/login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "../components/auth/RequireAuth";
import CambiarContrasena from "../pages/cambiar-contrasena/cambiarContrasena";

import RecuperarPassword from "../pages/password/RecuperarPassword";
import VerificarCodigo from "../pages/password/VerificarCodigo";
import NuevaPassword from "../pages/password/NuevaPassword";

// ADMIN – Alumnos
import AdminLayout from "../components/layout/AdminLayout";
import AlumnosListado from "../pages/admin/alumnos/AlumnosListado";
import CrearAlumno from "../pages/admin/alumnos/CrearAlumno";
import EditarAlumno from "../pages/admin/alumnos/EditarAlumno";

// ADMIN – Profesores
import ProfesoresListado from "../pages/admin/profesores/ProfesoresListado";
import CrearProfesor from "../pages/admin/profesores/CrearProfesor";
import EditarProfesor from "../pages/admin/profesores/EditarProfesor";

// ADMIN – Materias
import MateriasListado from "../pages/admin/materias/MateriasListado";
import CrearMateria from "../pages/admin/materias/CrearMateria";
import EditarMateria from "../pages/admin/materias/EditarMateria";

// Layouts Profesor / Alumno
import ProfesorLayout from "../components/layout/ProfesorLayout";
import AlumnoLayout from "../components/layout/AlumnoLayout";

// ADMIN – Clases
import ClasesListado from "../pages/admin/clases/ClasesListado";
import CrearClase from "../pages/admin/clases/CrearClase";
import EditarClase from "../pages/admin/clases/EditarClase";
import ClaseDetalle from "../pages/admin/clases/ClaseDetalle";

// ADMIN – Calificaciones
import CalificacionesListado from "../pages/admin/calificaciones/CalificacionesListado";
import CrearCalificacion from "../pages/admin/calificaciones/CrearCalificacion";
import EditarCalificacion from "../pages/admin/calificaciones/EditarCalificacion";

import AlumnosDesactivados from "../pages/admin/alumnos/AlumnosDesactivados";


export const router = createBrowserRouter([
  // ============================
  // PÚBLICAS
  // ============================
  { path: "/", element: <Login /> },
  { path: "/recuperar-password", element: <RecuperarPassword /> },
  { path: "/verificar-codigo", element: <VerificarCodigo /> },
  { path: "/nueva-password", element: <NuevaPassword /> },

  // ============================
  // CAMBIAR CONTRASEÑA
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
  // DASHBOARD (ANY ROLE)
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
  // ADMIN
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

      // 🔹 CRUD ALUMNOS
      { path: "alumnos", element: <AlumnosListado /> },
      { path: "alumnos/crear", element: <CrearAlumno /> },
      { path: "alumnos/editar/:id", element: <EditarAlumno /> },
      { path: "alumnos/desactivados", element: <AlumnosDesactivados /> },

      // 🔹 CRUD PROFESORES
      { path: "profesores", element: <ProfesoresListado /> },
      { path: "profesores/crear", element: <CrearProfesor /> },
      { path: "profesores/editar/:id", element: <EditarProfesor /> },

      // 🔹 CRUD MATERIAS
      { path: "materias", element: <MateriasListado /> },
      { path: "materias/crear", element: <CrearMateria /> },
      { path: "materias/editar/:id", element: <EditarMateria /> },
      // 🔹 CRUD CLASES
      { path: "clases", element: <ClasesListado /> },
      { path: "clases/crear", element: <CrearClase /> },
      { path: "clases/editar/:id", element: <EditarClase /> },
      { path: "clases/:id", element: <ClaseDetalle /> },
      // ADMIN/Profesores CCALIFICACIONES
      { path: "calificaciones", element: <CalificacionesListado /> },
      { path: "calificaciones/crear", element: <CrearCalificacion /> },
      { path: "calificaciones/editar/:id", element: <EditarCalificacion /> },

      
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
    ],
  },
]);
