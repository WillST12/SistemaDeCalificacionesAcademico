namespace Backend.API.Models.DTOs
{
    public class ClaseDTO
    {
        public int IdMateria { get; set; }
        public int IdProfesor { get; set; }
        public string Periodo { get; set; }

        public bool Activo { get; set; } = true;
    }
}
