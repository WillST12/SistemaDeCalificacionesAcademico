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
    public class InscripcionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InscripcionesController(ApplicationDbContext context)
        {
            _context = context;
        }

       
        [HttpPost]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> InscribirAlumno([FromBody] InscribirAlumnoDTO dto)
        {
            var alumno = await _context.Alumnos.FindAsync(dto.IdAlumno);
            var clase = await _context.Clases.FindAsync(dto.IdClase);

            if (alumno == null || clase == null)
                return BadRequest("Alumno o clase inválidos.");

            // Verificar si ya está inscrito
            bool existe = await _context.ClaseAlumnos
                .AnyAsync(ca => ca.IdAlumno == dto.IdAlumno && ca.IdClase == dto.IdClase);

            if (existe)
                return BadRequest("El alumno ya está inscrito en esta clase.");

            var claseAlumno = new ClaseAlumno
            {
                IdAlumno = dto.IdAlumno,
                IdClase = dto.IdClase
            };

            _context.ClaseAlumnos.Add(claseAlumno);
            await _context.SaveChangesAsync();

            return Ok("Alumno inscrito correctamente en la clase.");
        }

        // ✅ Obtener las clases en las que está inscrito un alumno
        [HttpGet("{idAlumno}")]
        [Authorize(Roles = "Alumno,Profesor,Admin")]
        public async Task<IActionResult> GetInscripcionesPorAlumno(int idAlumno)
        {
            var clases = await _context.ClaseAlumnos
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.Materia)
                .Include(ca => ca.Clase.Profesor)
                .Where(ca => ca.IdAlumno == idAlumno)
                .Select(ca => new
                {
                    ca.IdClase,
                    Materia = ca.Clase.Materia.Nombre,
                    Profesor = ca.Clase.Profesor.Nombre + " " + ca.Clase.Profesor.Apellido,
                    ca.Clase.Periodo
                })
                .ToListAsync();

            return Ok(clases);
        }
    }
}
