using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class Alumno
    {
        [Key]
        public int IdAlumno { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; }

        [Required, MaxLength(100)]
        public string Apellido { get; set; }

        public DateTime FechaNac { get; set; }

        [Required, MaxLength(20)]
        public string Matricula { get; set; }

        [Required, MaxLength(100)]
        public string Correo { get; set; }

        public bool Activo { get; set; } = true;

        // 🔗 Relación con Usuario (Login)
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        // 🔗 Relación con ClaseAlumnos
        public ICollection<ClaseAlumno> ClaseAlumnos { get; set; }
    }
}
