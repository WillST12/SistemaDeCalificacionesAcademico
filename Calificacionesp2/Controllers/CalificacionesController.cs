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
                .FirstOrDefaultAsync(ca => ca.IdClaseAlumno == dto.IdClaseAlumno);

            if (claseAlumno == null)
                return BadRequest("Inscripción no existe");

            // 🔒 VALIDACIÓN CLAVE
            if (!claseAlumno.Alumno.Activo)
                return BadRequest("No se puede registrar calificación: el alumno está inactivo.");

            var cal = new Calificaciones
            {
                IdClaseAlumno = dto.IdClaseAlumno,
                Nota = dto.Nota,
                Publicado = dto.Publicado,
                Vigente = true,
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
                    vigente = x.Vigente,  // ✅ Incluir vigencia
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

            if (!cal.Vigente)
                return BadRequest("No se puede editar una calificación archivada.");

            cal.Nota = dto.Nota;
            cal.Publicado = dto.Publicado;

            await _context.SaveChangesAsync();
            return Ok("Calificación actualizada.");
        }


        [HttpPut("publicar/{id}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> Publicar(int id, [FromBody] PublicarDTO dto)
        {
            var cal = await _context.Calificaciones.FindAsync(id);
            if (cal == null) return NotFound("No existe la calificación");

            if (!cal.Vigente)
                return BadRequest("No se puede publicar una calificación archivada.");

            cal.Publicado = dto.Publicado;
            await _context.SaveChangesAsync();

            return Ok(new { message = cal.Publicado ? "Calificación publicada" : "Calificación despublicada" });
        }


        // GET por alumno (Admin/Profesor)
        // Admin/Profesor: ven TODAS (vigentes e históricas)
        [HttpGet("alumno/{idAlumno}")]
        [Authorize(Roles = "Admin,Profesor")]
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
                    vigente = c.Vigente,  // ✅ Incluir vigencia
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo
                }).ToListAsync();

            return Ok(res);
        }

        // ✅ Alumno: SOLO SUS CALIFICACIONES PUBLICADAS Y VIGENTES
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
                    c.Publicado == true &&
                    c.Vigente == true  // ✅ Solo calificaciones vigentes
                )
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    nota = c.Nota,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo,
                    fechaRegistro = c.FechaRegistro
                })
                .ToListAsync();

            return Ok(res);
        }

        // GET por clase (Admin/Profesor)
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
                .Where(c =>
                    c.ClaseAlumno.Clase.IdClase == idClase &&
                    c.Vigente == true  // ✅ Solo mostrar vigentes en la gestión de clase
                )
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    alumnoId = c.ClaseAlumno.IdAlumno,
                    alumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    idClaseAlumno = c.IdClaseAlumno,
                    nota = c.Nota,
                    publicado = c.Publicado,
                    vigente = c.Vigente,  // ✅ Incluir vigencia
                    fechaRegistro = c.FechaRegistro,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo
                })
                .ToListAsync();

            return Ok(res);
        }

        // ✅ NUEVO: Historial completo (Admin/Profesor)
        [HttpGet("historial/{idAlumno}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> HistorialCompleto(int idAlumno)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c => c.ClaseAlumno.IdAlumno == idAlumno)
                .OrderByDescending(c => c.FechaRegistro)
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    nota = c.Nota,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo,
                    fechaRegistro = c.FechaRegistro,
                    publicado = c.Publicado,
                    vigente = c.Vigente  
                })
                .ToListAsync();

            return Ok(res);
        }
        // ✅ NUEVO: Calificaciones archivadas (alumnos inactivos)
        [HttpGet("archivadas")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> CalificacionesArchivadas()
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c => c.Vigente == false)  // ✅ Solo NO vigentes
                .OrderByDescending(c => c.FechaRegistro)
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    alumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    matricula = c.ClaseAlumno.Alumno.Matricula,
                    nota = c.Nota,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo,
                    fechaRegistro = c.FechaRegistro,
                    publicado = c.Publicado,
                    alumnoActivo = c.ClaseAlumno.Alumno.Activo
                })
                .ToListAsync();

            return Ok(res);
        }

        // ✅ NUEVO: Calificaciones archivadas por clase
        [HttpGet("archivadas/clase/{idClase}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> CalificacionesArchivadasPorClase(int idClase)
        {
            var res = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Alumno)
                .Include(c => c.ClaseAlumno)
                    .ThenInclude(ca => ca.Clase)
                        .ThenInclude(cl => cl.ProfesorMateria)
                            .ThenInclude(pm => pm.Materia)
                .Where(c =>
                    c.ClaseAlumno.Clase.IdClase == idClase &&
                    c.Vigente == false
                )
                .Select(c => new
                {
                    idCalificacion = c.IdCalificacion,
                    alumnoNombre = c.ClaseAlumno.Alumno.Nombre + " " + c.ClaseAlumno.Alumno.Apellido,
                    nota = c.Nota,
                    materia = c.ClaseAlumno.Clase.ProfesorMateria.Materia.Nombre,
                    periodo = c.ClaseAlumno.Clase.Periodo,
                    fechaRegistro = c.FechaRegistro,
                    publicado = c.Publicado,
                    vigente = c.Vigente
                })
                .ToListAsync();

            return Ok(res);
        }

    }
}