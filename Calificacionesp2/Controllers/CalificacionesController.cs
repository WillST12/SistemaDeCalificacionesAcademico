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

        // ✅ 1. Asignar calificación (solo profesor)
        [HttpPost]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> AsignarCalificacion([FromBody] CalificacionDTO dto)
        {
            var claseAlumno = await _context.ClaseAlumnos
                .Include(ca => ca.Clase)
                .FirstOrDefaultAsync(ca => ca.IdClaseAlumno == dto.IdClaseAlumno);

            if (claseAlumno == null)
                return BadRequest("El alumno no está inscrito en la clase especificada.");

            var calificacion = new Calificaciones
            {
                IdClaseAlumno = dto.IdClaseAlumno,
                Nota = dto.Nota,
                FechaRegistro = DateTime.Now
            };

            _context.Calificaciones.Add(calificacion);
            await _context.SaveChangesAsync();

            return Ok("✅ Calificación registrada correctamente.");
        }

        // ✅ 2. Obtener calificaciones por alumno
        [HttpGet("alumno/{idAlumno}")]
        [Authorize(Roles = "Alumno,Profesor,Admin")]
        public async Task<IActionResult> GetCalificacionesAlumno(int idAlumno)
        {
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Include(c => c.ClaseAlumno.Clase.ProfesorMateria.Profesor)
                .Where(c => c.ClaseAlumno.IdAlumno == idAlumno)
                .Select(c => new
                {
                    c.IdCalificacion,
                    c.Nota,
                    c.FechaRegistro,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Profesor = c.ClaseAlumno.Clase.ProfesorMateria.Profesor.Nombre + " " + c.ClaseAlumno.Clase.ProfesorMateria.Profesor.Apellido,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            if (!calificaciones.Any())
                return NotFound("El alumno no tiene calificaciones registradas.");

            return Ok(calificaciones);
        }

        // ✅ 3. Obtener calificaciones por clase (Admin y Profesor)
        [HttpGet("clase/{idClase}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> GetCalificacionesPorClase(int idClase)
        {
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno.Clase)
                    .ThenInclude(cl => cl.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .Where(c => c.ClaseAlumno.IdClase == idClase)
                .Select(c => new
                {
                    Alumno = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Nota = c.Nota,
                    Fecha = c.FechaRegistro,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            if (!calificaciones.Any())
                return NotFound("No hay calificaciones registradas para esta clase.");

            return Ok(calificaciones);
        }

        // ✅ 4. Obtener calificaciones por materia (solo Admin)
        [HttpGet("materia/{idMateria}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCalificacionesPorMateria(int idMateria)
        {
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno.Clase)
                    .ThenInclude(cl => cl.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .Where(c => c.ClaseAlumno.Clase.ProfesorMateria.IdMateria == idMateria)
                .Select(c => new
                {
                    Alumno = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Profesor = c.ClaseAlumno.Clase.ProfesorMateria.Profesor.Nombre + " " + c.ClaseAlumno.Clase.ProfesorMateria.Profesor.Apellido,
                    Nota = c.Nota,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            if (!calificaciones.Any())
                return NotFound("No hay calificaciones registradas para esta materia.");

            return Ok(calificaciones);
        }
    }
}
