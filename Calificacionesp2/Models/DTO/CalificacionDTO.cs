// Backend.API/Models/DTOs/CalificacionDTO.cs
namespace Backend.API.Models.DTOs
{
    public class CalificacionDTO
    {
        public int IdClaseAlumno { get; set; }
        public decimal Nota { get; set; }
        public bool Publicado { get; set; }
    }
}
