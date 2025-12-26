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
    [Authorize]
    public class AlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlumnosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // CREAR ALUMNO (ADMIN)
        // =========================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CrearAlumno([FromBody] AlumnoDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);

            if (usuario == null)
                return BadRequest("El usuario no existe.");

            if (usuario.IdRol != 3)
                return BadRequest("El usuario no tiene rol de Alumno.");

            var alumno = new Alumno
            {
                IdUsuario = dto.IdUsuario,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                FechaNac = dto.FechaNac,
                Matricula = dto.Matricula,
                Correo = dto.Correo,
                Activo = true
            };

            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return Ok(new { alumno.IdAlumno });
        }

        // =========================
        // LISTAR ALUMNOS + ÍNDICE (ADMIN)
        // =========================
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAlumnos()
        {
            var alumnos = await _context.Alumnos
                .Include(a => a.Usuario)
                .OrderBy(a => a.Nombre)
                .Select(a => new
                {
                    a.IdAlumno,
                    a.Nombre,
                    a.Apellido,
                    a.Correo,
                    a.Matricula,
                    a.Activo,

                    // 🔹 ÍNDICE (0–100) en base a calificaciones PUBLICADAS Y VIGENTES
                    Indice = _context.Calificaciones
                        .Where(c =>
                            c.Publicado &&
                            c.Vigente &&  // ✅ Solo calificaciones vigentes
                            c.ClaseAlumno.IdAlumno == a.IdAlumno
                        )
                        .Select(c => (double?)c.Nota)
                        .Average() ?? 0
                })
                .ToListAsync();

            return Ok(alumnos);
        }

        // =========================
        // OBTENER ALUMNO POR ID (ADMIN)
        // =========================
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAlumnoPorId(int id)
        {
            var alumno = await _context.Alumnos
                .Include(a => a.Usuario)
                .FirstOrDefaultAsync(a => a.IdAlumno == id);

            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            return Ok(alumno);
        }

        // =========================
        // EDITAR ALUMNO (ADMIN)
        // =========================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditarAlumno(int id, [FromBody] AlumnoDTO dto)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            alumno.Nombre = dto.Nombre;
            alumno.Apellido = dto.Apellido;
            alumno.FechaNac = dto.FechaNac;
            alumno.Matricula = dto.Matricula;
            alumno.Correo = dto.Correo;

            await _context.SaveChangesAsync();
            return Ok("Alumno actualizado correctamente.");
        }

        // PUT: api/Alumnos/desactivar/{id}
        [HttpPut("desactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DesactivarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound("Alumno no encontrado");

            // Desactivar alumno
            alumno.Activo = false;

            // ✅ Marcar TODAS sus calificaciones como NO vigentes
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                .Where(c => c.ClaseAlumno.IdAlumno == id)
                .ToListAsync();

            foreach (var cal in calificaciones)
            {
                cal.Vigente = false;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Alumno desactivado correctamente",
                calificacionesArchivadas = calificaciones.Count
            });
        }

        // PUT: api/Alumnos/reactivar/{id}
        [HttpPut("reactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound("Alumno no encontrado");

            // Reactivar alumno
            alumno.Activo = true;

            // ✅ Marcar TODAS sus calificaciones como vigentes nuevamente
            var calificaciones = await _context.Calificaciones
                .Include(c => c.ClaseAlumno)
                .Where(c => c.ClaseAlumno.IdAlumno == id)
                .ToListAsync();

            foreach (var cal in calificaciones)
            {
                cal.Vigente = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Alumno reactivado correctamente",
                calificacionesRestauradas = calificaciones.Count
            });
        }

        // =========================
        // OBTENER ALUMNO POR USUARIO (ALUMNO)
        // =========================
        [HttpGet("por-usuario/{idUsuario}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> GetAlumnoPorUsuario(int idUsuario)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.IdUsuario == idUsuario && a.Activo);

            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            return Ok(new
            {
                alumno.IdAlumno,
                alumno.Nombre,
                alumno.Apellido
            });
        }
    }
}