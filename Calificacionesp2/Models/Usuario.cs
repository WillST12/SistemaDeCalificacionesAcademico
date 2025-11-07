using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.API.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(50)]
        public string NombreUsuario { get; set; }

        [Required]
        public string ContrasenaHash { get; set; }

        [Required]
        public int IdRol { get; set; }

        [JsonIgnore]
        public Rol Rol { get; set; }

        public bool Activo { get; set; } = true;
    }
}
