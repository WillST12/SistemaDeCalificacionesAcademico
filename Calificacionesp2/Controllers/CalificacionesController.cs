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
    public class CalificacionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CalificacionesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Asignar calificación (solo profesor)
        [HttpPost]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> AsignarCalificacion([FromBody] CalificacionDTO dto)
        {
            var claseAlumno = await _context.ClaseAlumnos
                .FirstOrDefaultAsync(ca => ca.IdClaseAlumno == dto.IdClaseAlumno);

            if (claseAlumno == null)
                return BadRequest("El alumno no está inscrito en la clase especificada.");

            var calificacion = new Calificacion
            {
                IdClaseAlumno = dto.IdClaseAlumno,
                Nota = dto.Nota,
                FechaRegistro = DateTime.Now
            };

            _context.Calificaciones.Add(calificacion);
            await _context.SaveChangesAsync();

            return Ok("✅ Calificación registrada correctamente.");
        }

        // ✅ Obtener calificaciones por alumno
        [HttpGet("alumno/{idAlumno}")]
        [Authorize(Roles = "Alumno,Profesor,Admin")]
        public async Task<IActionResult> GetCalificacionesAlumno(int idAlumno)
        {
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(c => c.Materia)
                .Where(c => c.ClaseAlumno.IdAlumno == idAlumno)
                .Select(c => new
                {
                    c.IdCalificacion,
                    c.Nota,
                    c.FechaRegistro,
                    Materia = c.ClaseAlumno.Clase.Materia.Nombre,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            return Ok(calificaciones);
        }
    }
}
