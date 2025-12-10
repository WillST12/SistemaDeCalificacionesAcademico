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
                .Include(x => x.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(x => x.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(x => x.IdCalificacion == id)
                .Select(x => new {
                    idCalificacion = x.IdCalificacion,
                    idClaseAlumno = x.IdClaseAlumno,
                    nota = x.Nota,
                    publicado = x.Publicado,
                    fechaRegistro = x.FechaRegistro,
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

        // PUT api/Calificaciones/publicar/{id}  body: bool
        [HttpPut("publicar/{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Publicar(int id, [FromBody] bool publicar)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null)
                return NotFound("No existe la calificación");

            cal.Publicado = publicar;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET por clase
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
                    idCalificacion = c.IdCalificacion,
                    alumnoId = c.ClaseAlumno.Alumno.IdAlumno,
                    alumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    nota = c.Nota,
                    fechaRegistro = c.FechaRegistro,
                    publicado = c.Publicado,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo
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

        // GET por materia + periodo
        [HttpGet("materia/{idMateria}/periodo/{periodo}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> PorMateriaPeriodo(int idMateria, string periodo)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                .Where(c => c.ClaseAlumno.Clase.ProfesorMateria.IdMateria == idMateria
                            && c.ClaseAlumno.Clase.Periodo == periodo)
                .Select(c => new {
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
    }
}
