using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models.DTOs
{
    public class CrearProfesorDTO
    {
        [Required]
        public int IdUsuario { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Apellido { get; set; }

        public string Correo { get; set; }
        public string Especialidad { get; set; }
    }
}
