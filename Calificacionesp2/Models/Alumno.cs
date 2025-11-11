using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class Alumno
    {
        [Key]
        public int IdAlumno { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(100)]
        public string Apellido { get; set; }

        [Required]
        public DateTime FechaNac { get; set; }

        [Required]
        [MaxLength(20)]
        public string Matricula { get; set; }

        [MaxLength(100)]
        public string Correo { get; set; }

        public bool Activo { get; set; } = true;

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        // 🔥 Propiedad necesaria para la relación N:M con Clases
        public ICollection<ClaseAlumno> ClaseAlumnos { get; set; } = new List<ClaseAlumno>();
    }
}
