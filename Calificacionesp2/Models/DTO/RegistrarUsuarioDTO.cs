namespace Backend.API.Models.DTOs
{
    public class RegistrarUsuarioDTO
    {
        public string NombreUsuario { get; set; }
        public string Contrasena { get; set; }
        public int IdRol { get; set; } // 1 Admin, 2 Profesor, 3 Alumno
    }
}
