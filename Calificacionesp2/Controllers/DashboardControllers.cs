// Controllers/DashboardController.cs
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

        // =============================
        // ADMIN DASHBOARD
        // =============================
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDashboard()
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

        // =============================
        // PROFESOR DASHBOARD
        // =============================
        [HttpGet("profesor/{idUsuario}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> ProfesorDashboard(int idUsuario)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.IdUsuario == idUsuario);

            if (profesor == null)
                return NotFound();

            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                .Where(c => c.ProfesorMateria.IdProfesor == profesor.IdProfesor)
                .ToListAsync();

            return Ok(new
            {
                totalClases = clases.Count,
                totalAlumnos = await _context.ClaseAlumnos
                    .CountAsync(ca => clases.Select(c => c.IdClase).Contains(ca.IdClase)),
                calificacionesRegistradas = await _context.Calificaciones
                    .CountAsync(c => clases.Select(cl => cl.IdClase)
                    .Contains(c.ClaseAlumno.IdClase))
            });
        }

        // =============================
        // ALUMNO DASHBOARD
        // =============================
        [HttpGet("alumno/{idUsuario}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> AlumnoDashboard(int idUsuario)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.IdUsuario == idUsuario);

            if (alumno == null)
                return NotFound();

            return Ok(new
            {
                clasesInscritas = await _context.ClaseAlumnos
                    .CountAsync(ca => ca.IdAlumno == alumno.IdAlumno),
                calificacionesPublicadas = await _context.Calificaciones
                    .CountAsync(c => c.ClaseAlumno.IdAlumno == alumno.IdAlumno && c.Publicado)
            });
        }
    }
}
