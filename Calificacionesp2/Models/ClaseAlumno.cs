using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class ClaseAlumno
    {
        [Key]
        public int IdClaseAlumno { get; set; }

        [ForeignKey("Clase")]
        public int IdClase { get; set; }
        public Clase Clase { get; set; }

        [ForeignKey("Alumno")]
        public int IdAlumno { get; set; }
        public Alumno Alumno { get; set; }
    }
}
