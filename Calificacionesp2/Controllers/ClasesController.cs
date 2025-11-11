using Backend.API.Data;
using Backend.API.Models;
using Backend.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CrearClase([FromBody] ClaseDTO dto)
        {
            var clase = new Clase
            {
                IdMateria = dto.IdMateria,
                IdProfesor = dto.IdProfesor,
                Periodo = dto.Periodo,
                Activo = true
            };

            _context.Clases.Add(clase);
            await _context.SaveChangesAsync();
            return Ok("Clase creada correctamente.");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetClases()
        {
            var clases = await _context.Clases
                .Include(c => c.Materia)
                .Include(c => c.Profesor)
                .ToListAsync();
            return Ok(clases);
        }
    }
}
