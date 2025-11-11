using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class Clase
    {
        [Key]
        public int IdClase { get; set; }

        [Required]
        public int IdProfesor { get; set; }
        public Profesor Profesor { get; set; }

        [Required]
        public int IdMateria { get; set; }
        public Materia Materia { get; set; }

        [Required, MaxLength(20)]
        public string Periodo { get; set; }

        public bool Activo { get; set; } = true;

        public ICollection<ClaseAlumno> ClaseAlumnos { get; set; }
    }
}
