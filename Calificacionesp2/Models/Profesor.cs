using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.API.Models
{
    public class Profesor
    {
        [Key]
        public int IdProfesor { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; }

        [Required, MaxLength(100)]
        public string Apellido { get; set; }

        [MaxLength(100)]
        public string Correo { get; set; }

        [MaxLength(100)]
        public string Especialidad { get; set; }

        public bool Activo { get; set; } = true;

        // 🔗 Relación con Usuario
        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        // 🔗 Relaciones con otras tablas
        public ICollection<ProfesorMateria> ProfesorMaterias { get; set; } = new List<ProfesorMateria>();
        public ICollection<Clase> Clases { get; set; } = new List<Clase>();
    }
}
