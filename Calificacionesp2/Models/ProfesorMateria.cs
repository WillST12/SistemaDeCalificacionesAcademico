using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models
{
    public class ProfesorMateria
    {
        [Key]
        public int IdProfesorMateria { get; set; }

        public int IdProfesor { get; set; }
        public Profesor Profesor { get; set; }

        public int IdMateria { get; set; }
        public Materia Materia { get; set; }
    }
}
