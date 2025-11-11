using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }

        [Required, MaxLength(50)]
        public string Nombre { get; set; }
    }
}
