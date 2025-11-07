using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class Calificacion
    {
        [Key]
        public int IdCalificacion { get; set; }

        public int IdClaseAlumno { get; set; }
        public ClaseAlumno ClaseAlumno { get; set; }

        public decimal Nota { get; set; } // DECIMAL(5,2)
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}
