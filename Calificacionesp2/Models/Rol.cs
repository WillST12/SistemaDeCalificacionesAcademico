using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Backend.API.Models
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }
        [Required]
        public string Nombre { get; set; }

        public ICollection<Usuario> Usuarios { get; set; }
    }
}
