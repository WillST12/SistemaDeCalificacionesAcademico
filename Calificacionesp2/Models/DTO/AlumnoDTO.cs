namespace Backend.API.Models.DTOs
{
    public class AlumnoDTO
    {
        public int IdUsuario { get; set; } 
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public DateTime FechaNac { get; set; }
        public string Matricula { get; set; }
        public string Correo { get; set; }
    }
}
