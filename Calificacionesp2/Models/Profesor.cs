using System.ComponentModel.DataAnnotations;

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

        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public ICollection<ProfesorMateria> ProfesorMaterias { get; set; }
        public ICollection<Clase> Clases { get; set; }
    }
}
