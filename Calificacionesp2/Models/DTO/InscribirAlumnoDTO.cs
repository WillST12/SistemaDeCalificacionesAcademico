using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.API.Models.DTOs
{
    public class InscribirAlumnoDTO
    {
        
        public int IdClase { get; set; }
        public int IdAlumno { get; set; }
        public string CodigoMateria { get; set; }
    }
}
