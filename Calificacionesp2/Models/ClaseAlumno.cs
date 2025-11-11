using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class ClaseAlumno
    {
        [Key]
        public int IdClaseAlumno { get; set; }

        [Required]
        [ForeignKey("clase")]
        public int IdClase { get; set; }
        public Clase Clase { get; set; }

        [Required]
        [ForeignKey("Alumno")]
        public int IdAlumno { get; set; }
        public Alumno Alumno { get; set; }

        public ICollection<Calificacion> Calificaciones { get; set; }
    }
}
