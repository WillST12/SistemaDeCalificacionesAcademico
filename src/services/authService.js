import { api } from "./axiosConfig";

export const authService = {

  registerAlumno: async (data) => {
    const res = await api.post("/auth/register-alumno", data);
    return res.data; // devuelve { idUsuario }
  },

  registerProfesor: async (data) => {
  const res = await api.post("/auth/register-profesor", data);
  return res.data; // devuelve { idUsuario }
},


  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  cambiarContrasena: async (data) => {
    const res = await api.post("/auth/cambiar-contrasena", data);
    return res.data;
  },

  solicitarRecuperacion: async (correo) => {
    const res = await api.post("/auth/solicitar-recuperacion", { correo });
    return res.data;
  },

  verificarCodigo: async (data) => {
    const res = await api.post("/auth/verificar-codigo", data);
    return res.data;
  },

  restablecerPassword: async (data) => {
    const res = await api.post("/auth/restablecer-password", data);
    return res.data;
  }
};
