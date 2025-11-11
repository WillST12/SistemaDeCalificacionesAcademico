using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class Materia
    {
        [Key]
        public int IdMateria { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; }

        [Required, MaxLength(20)]
        public string Codigo { get; set; }

        [MaxLength(250)]
        public string Descripcion { get; set; }

        public bool Activo { get; set; } = true;
    }
}
