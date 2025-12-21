// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

// ============================
// RUTAS PÚBLICAS
// ============================
import Login from "../pages/login/Login";
import RecuperarPassword from "../pages/password/RecuperarPassword";
import VerificarCodigo from "../pages/password/VerificarCodigo";
import NuevaPassword from "../pages/password/NuevaPassword";

// ============================
// DASHBOARD GENERAL
// ============================
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";
import RequireAuth from "../components/auth/RequireAuth";
import CambiarContrasena from "../pages/cambiar-contrasena/cambiarContrasena";

// ============================
// ADMIN
// ============================
import AdminLayout from "../components/layout/AdminLayout";

// Alumnos
import AlumnosListado from "../pages/admin/alumnos/AlumnosListado";
import CrearAlumno from "../pages/admin/alumnos/CrearAlumno";
import EditarAlumno from "../pages/admin/alumnos/EditarAlumno";

// Profesores
import ProfesoresListado from "../pages/admin/profesores/ProfesoresListado";
import CrearProfesor from "../pages/admin/profesores/CrearProfesor";
import EditarProfesor from "../pages/admin/profesores/EditarProfesor";

// Materias
import MateriasListado from "../pages/admin/materias/MateriasListado";
import CrearMateria from "../pages/admin/materias/CrearMateria";
import EditarMateria from "../pages/admin/materias/EditarMateria";

// Clases
import ClasesListado from "../pages/admin/clases/ClasesListado";
import CrearClase from "../pages/admin/clases/CrearClase";
import EditarClase from "../pages/admin/clases/EditarClase";
import ClaseDetalle from "../pages/admin/clases/ClaseDetalle";

// Calificaciones (ADMIN)
import CalificacionesListado from "../pages/admin/calificaciones/CalificacionesListado";
import CrearCalificacion from "../pages/admin/calificaciones/CrearCalificacion";
import EditarCalificacion from "../pages/admin/calificaciones/EditarCalificacion";

// ============================
// PROFESOR
// ============================
import ProfesorLayout from "../components/layout/ProfesorLayout";
//import ProfesorClases from "../pages/profesor/clases/MisClasesProfesor";
//import ProfesorMaterias from "../pages/profesor/materias/MisMateriasProfesor";
//import ProfesorCalificaciones from "../pages/profesor/calificaciones/CalificacionesProfesor";
import MisClasesProfesor from "../pages/admin/profesores/MisClasesProfesor";
import MisMateriasProfesor from "../pages/admin/profesores/MisMateriasProfesor";
import CalificacionesProfesor from "../pages/admin/profesores/CalificacionesProfesor";

// ============================
// ALUMNO
// ============================
import AlumnoLayout from "../components/layout/AlumnoLayout";
import MisClases from "../pages/admin/alumnos/MisClases";
import MisCalificaciones from "../pages/admin/alumnos/MisCalificaciones";

// ============================
// ROUTER
// ============================
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
  // DASHBOARD GENERAL
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

      { path: "alumnos", element: <AlumnosListado /> },
      { path: "alumnos/crear", element: <CrearAlumno /> },
      { path: "alumnos/editar/:id", element: <EditarAlumno /> },

      { path: "profesores", element: <ProfesoresListado /> },
      { path: "profesores/crear", element: <CrearProfesor /> },
      { path: "profesores/editar/:id", element: <EditarProfesor /> },

      { path: "materias", element: <MateriasListado /> },
      { path: "materias/crear", element: <CrearMateria /> },
      { path: "materias/editar/:id", element: <EditarMateria /> },

      { path: "clases", element: <ClasesListado /> },
      { path: "clases/crear", element: <CrearClase /> },
      { path: "clases/editar/:id", element: <EditarClase /> },
      { path: "clases/:id", element: <ClaseDetalle /> },

      { path: "calificaciones", element: <CalificacionesListado /> },
      { path: "calificaciones/crear", element: <CrearCalificacion /> },
      { path: "calificaciones/editar/:id", element: <EditarCalificacion /> },
    ],
  },

  // ============================
  // PROFESOR ✅ (YA FUNCIONA CON SIDEBAR)
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
      { path: "materias", element: <MisMateriasProfesor /> },
      { path: "clases", element: <MisClasesProfesor /> },
      { path: "calificaciones", element: <CalificacionesProfesor   /> },
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
      { path: "clases", element: <MisClases /> },
      { path: "calificaciones", element: <MisCalificaciones /> },
    ],
  },
]);
