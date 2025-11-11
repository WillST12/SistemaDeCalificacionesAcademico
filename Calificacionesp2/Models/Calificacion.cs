using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class Calificacion
    {
        [Key]
        public int IdCalificacion { get; set; }

        [ForeignKey("ClaseAlumno")]
        public int IdClaseAlumno { get; set; }
        public ClaseAlumno ClaseAlumno { get; set; }

        [Range(0, 100)]
        public decimal Nota { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}

