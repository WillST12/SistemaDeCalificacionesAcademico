using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models.DTOs
{
    public class RegistrarUsuarioDTO
    {
        [Required]
        public string NombreUsuario { get; set; }

        [Required]
        public string Contrasena { get; set; }

        [Required]
        public int IdRol { get; set; }
    }
}
