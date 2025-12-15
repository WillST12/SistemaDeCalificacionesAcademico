using Backend.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 DASHBOARD ADMIN 
        // =========================
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Admin()
        {
            return Ok(new
            {
                alumnosActivos = await _context.Alumnos.CountAsync(a => a.Activo),
                profesoresActivos = await _context.Profesores.CountAsync(p => p.Activo),
                clasesActivas = await _context.Clases.CountAsync(c => c.Activo),
                materias = await _context.Materias.CountAsync(),
                calificaciones = await _context.Calificaciones.CountAsync()
            });
        }

        // =========================
        // 🔹 DASHBOARD PROFESOR
        // =========================
        [HttpGet("profesor/{idUsuario}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> DashboardProfesor(int idUsuario)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.IdUsuario == idUsuario);

            if (profesor == null) return BadRequest();

            var clases = await _context.Clases
                .Where(c => c.ProfesorMateria.IdProfesor == profesor.IdProfesor)
                .ToListAsync();

            var totalAlumnos = await _context.ClaseAlumnos
                .CountAsync(ca => clases.Select(c => c.IdClase).Contains(ca.IdClase));

            var calificaciones = await _context.Calificaciones
                .CountAsync(c => clases.Select(ca => ca.IdClase)
                .Contains(c.ClaseAlumno.IdClase));

            return Ok(new
            {
                totalClases = clases.Count,
                totalAlumnos,
                calificacionesRegistradas = calificaciones
            });
        }


        // =========================
        // 🔹 DASHBOARD ALUMNO
        // =========================
        [HttpGet("alumno/{idUsuario}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> DashboardAlumno(int idUsuario)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.IdUsuario == idUsuario);

            if (alumno == null) return BadRequest();

            var clases = await _context.ClaseAlumnos
                .Where(ca => ca.IdAlumno == alumno.IdAlumno)
                .ToListAsync();

            var calificacionesPublicadas = await _context.Calificaciones
                .CountAsync(c =>
                    c.ClaseAlumno.IdAlumno == alumno.IdAlumno &&
                    c.Publicado == true
                );

            return Ok(new
            {
                clasesInscritas = clases.Count,
                calificacionesPublicadas
            });
        }

    }
}
