using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class ProfesorMateria
    {
        [Key]
        public int IdProfesorMateria { get; set; }

        [Required]
        public int IdProfesor { get; set; }
        public Profesor Profesor { get; set; }

        [Required]
        public int IdMateria { get; set; }
        public Materia Materia { get; set; }
    }
}
