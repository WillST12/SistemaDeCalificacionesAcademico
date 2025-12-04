using Microsoft.EntityFrameworkCore.Metadata.Internal;
//MODULO INSCRIBIR ALUMNO REALIZADO
namespace Backend.API.Models.DTOs
{
    public class InscribirAlumnoDTO
    {
        
        public int IdClase { get; set; }
        public int IdAlumno { get; set; }
       //public string CodigoMateria { get; set; }
    }
}
