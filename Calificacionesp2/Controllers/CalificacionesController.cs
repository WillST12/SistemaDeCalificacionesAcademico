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
            var claseAlumno = await _context.ClaseAlumnos
                .Include(ca => ca.Alumno)
                .Include(ca => ca.Clase)
                .FirstOrDefaultAsync(ca => ca.IdClaseAlumno == dto.IdClaseAlumno);

            if (claseAlumno == null)
                return BadRequest("Inscripción no existe");

            var cal = new Calificaciones
            {
                IdClaseAlumno = dto.IdClaseAlumno,
                Nota = dto.Nota,
                Publicado = dto.Publicado,
                FechaRegistro = DateTime.Now
            };

            _context.Calificaciones.Add(cal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Calificación registrada correctamente" });
        }

        // GET: obtener una calificación por ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _context.Calificaciones
                .Include(ca => ca.ClaseAlumno)
                    .ThenInclude(a => a.Alumno)
                .Include(ca => ca.ClaseAlumno)
                    .ThenInclude(cl => cl.Clase)
                        .ThenInclude(pm => pm.ProfesorMateria)
                            .ThenInclude(m => m.Materia)
                .Where(x => x.IdCalificacion == id)
                .Select(x => new
                {
                    idCalificacion = x.IdCalificacion,
                    nota = x.Nota,
                    publicado = x.Publicado,
                    alumno = x.ClaseAlumno.Alumno.Nombre + " " + x.ClaseAlumno.Alumno.Apellido,
                    materia = x.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = x.ClaseAlumno.Clase.Periodo
                })
                .FirstOrDefaultAsync();

            if (c == null) return NotFound();
            return Ok(c);
        }

        // PUT: editar nota
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Editar(int id, [FromBody] CalificacionDTO dto)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null) return NotFound("Calificación no encontrada.");

            cal.Nota = dto.Nota;
            cal.Publicado = dto.Publicado;

            await _context.SaveChangesAsync();
            return Ok("Calificación actualizada.");
        }

        // PUT publicar
        [HttpPut("publicar/{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Publicar(int id, [FromBody] bool publicar)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null) return NotFound("No existe la calificación");

            cal.Publicado = publicar;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET por alumno (Admin/Profesor/Alumno)
        // Admin/Profesor: ven todo
        // Alumno: debería usar "mis-calificaciones/{idAlumno}" (solo publicadas)
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
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    alumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    nota = c.Nota,
                    fechaRegistro = c.FechaRegistro,
                    publicado = c.Publicado,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo
                }).ToListAsync();

            return Ok(res);
        }

        // ✅ Alumno: SOLO SUS CALIFICACIONES PUBLICADAS
        // GET api/Calificaciones/mis-calificaciones/{idAlumno}
        [HttpGet("mis-calificaciones/{idAlumno}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> MisCalificaciones(int idAlumno)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c =>
                    c.ClaseAlumno.IdAlumno == idAlumno &&
                    c.Publicado == true
                )
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    nota = c.Nota,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            return Ok(res);
        }
    }
}
