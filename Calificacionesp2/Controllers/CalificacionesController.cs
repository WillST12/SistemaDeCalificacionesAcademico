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
        public CalificacionesController(ApplicationDbContext context) { _context = context; }

        // POST: crear calificación (admin/profesor)
        [HttpPost]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Crear([FromBody] CalificacionDTO dto)
        {
            // validar existencia de la inscripción (ClaseAlumno)
            var claseAlumno = await _context.ClaseAlumnos
                .Include(ca => ca.Alumno)
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .FirstOrDefaultAsync(ca => ca.IdClaseAlumno == dto.IdClaseAlumno);

            if (claseAlumno == null) return BadRequest("Inscripción inválida.");

            var cal = new Calificaciones
            {
                IdClaseAlumno = dto.IdClaseAlumno,
                Nota = dto.Nota,
                FechaRegistro = DateTime.UtcNow,
                Publicado = dto.Publicado
            };

            _context.Calificaciones.Add(cal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Calificación registrada.", idCalificacion = cal.IdCalificacion });
        }

        // PUT: editar nota
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Editar(int id, [FromBody] CalificacionDTO dto)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null) return NotFound("Calificación no encontrada.");

            cal.Nota = dto.Nota;
            // No forzamos FechaRegistro. Si quieres guardar edición: cal.FechaRegistro = DateTime.UtcNow;
            cal.Publicado = dto.Publicado;

            await _context.SaveChangesAsync();
            return Ok("Calificación actualizada.");
        }

        // PUT: publicar / despublicar
        [HttpPut("publicar/{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Publicar(int id, [FromBody] bool publicar)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null) return NotFound("Calificación no encontrada.");

            cal.Publicado = publicar;
            await _context.SaveChangesAsync();
            return Ok(new { message = publicar ? "Publicado" : "Despublicado" });
        }

        // GET por clase (devuelve alumno nombre y demás)
        [HttpGet("clase/{idClase}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> PorClase(int idClase)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c => c.ClaseAlumno.Clase.IdClase == idClase)
                .Select(c => new {
                    c.IdCalificacion,
                    AlumnoId = c.ClaseAlumno.Alumno.IdAlumno,
                    AlumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    c.Nota,
                    FechaRegistro = c.FechaRegistro,
                    c.Publicado,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                }).ToListAsync();

            return Ok(res);
        }

        // GET por materia
        [HttpGet("materia/{idMateria}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> PorMateria(int idMateria)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                .Where(c => c.ClaseAlumno.Clase.ProfesorMateria.IdMateria == idMateria)
                .Select(c => new {
                    c.IdCalificacion,
                    AlumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    c.Nota,
                    c.FechaRegistro,
                    c.Publicado,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                }).ToListAsync();

            return Ok(res);
        }

        // GET por alumno
        [HttpGet("alumno/{idAlumno}")]
        [Authorize(Roles = "Admin,Profesor,Alumno")]
        public async Task<IActionResult> PorAlumno(int idAlumno)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c => c.ClaseAlumno.IdAlumno == idAlumno)
                .Select(c => new {
                    c.IdCalificacion,
                    AlumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    c.Nota,
                    c.FechaRegistro,
                    c.Publicado,
                    Materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    Periodo = c.ClaseAlumno.Clase.Periodo
                }).ToListAsync();

            return Ok(res);
        }
    }
}
