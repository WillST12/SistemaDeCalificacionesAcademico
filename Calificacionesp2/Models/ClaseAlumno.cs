using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class ClaseAlumno
    {
        [Key]
        public int IdClaseAlumno { get; set; }

        public int IdClase { get; set; }
        public Clase Clase { get; set; }

        public int IdAlumno { get; set; }
        public Alumno Alumno { get; set; }

        public ICollection<Calificacion> Calificaciones { get; set; }
    }
}
