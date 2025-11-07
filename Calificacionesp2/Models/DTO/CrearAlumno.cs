using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models.DTOs
{
    public class CrearAlumnoDTO
    {
        [Required]
        public int IdUsuario { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Apellido { get; set; }

        public DateTime FechaNac { get; set; }

        [Required]
        public string Matricula { get; set; }

        public string Correo { get; set; }
    }
}
