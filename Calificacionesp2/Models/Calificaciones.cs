// Backend.API/Models/Calificaciones.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class Calificaciones
    {
        [Key]
        public int IdCalificacion { get; set; }

        [Required]
        [ForeignKey("ClaseAlumno")]
        public int IdClaseAlumno { get; set; }
        public ClaseAlumno ClaseAlumno { get; set; }

        [Required]
        public decimal Nota { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        public bool Publicado { get; set; } = false;
    }
}
