namespace Backend.API.Models.DTOs
{
    public class RegistrarAlumnoDTO
    {
        public string NombreUsuario { get; set; }
        public string Contrasena { get; set; }

        // datos del alumno
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Correo { get; set; }
        public string Matricula { get; set; }
        public DateTime FechaNacimiento { get; set; }
    }
}
