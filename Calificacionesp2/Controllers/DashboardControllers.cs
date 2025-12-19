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

   
        [HttpGet("profesor/{idUsuario}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> DashboardProfesor(int idUsuario)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.IdUsuario == idUsuario && p.Activo);

            if (profesor == null)
                return BadRequest("Profesor no válido o inactivo");

            // 🔹 Clases del profesor
            var clasesIds = await _context.Clases
                .Where(c => c.Activo && c.ProfesorMateria.IdProfesor == profesor.IdProfesor)
                .Select(c => c.IdClase)
                .ToListAsync();

            // 🔹 Total de alumnos (sin duplicar)
            var totalAlumnos = await _context.ClaseAlumnos
                .Where(ca => clasesIds.Contains(ca.IdClase))
                .Select(ca => ca.IdAlumno)
                .Distinct()
                .CountAsync();

            // 🔹 Calificaciones del profesor
            var calificaciones = await _context.Calificaciones
                .Where(c => clasesIds.Contains(c.ClaseAlumno.IdClase))
                .ToListAsync();

            var totalCalificaciones = calificaciones.Count;

            // 🔹 Índice promedio
            decimal indicePromedio = 0;

            if (totalCalificaciones > 0)
            {
                indicePromedio = Math.Round(
                    calificaciones.Average(c => c.Nota),
                    2
                );
            }

            return Ok(new
            {
                totalClases = clasesIds.Count,
                totalAlumnos,
                calificacionesRegistradas = totalCalificaciones,
                indicePromedio
            });
        }



        // =========================
        // 🔹 DASHBOARD ALUMNO
        // =========================
        // =========================
        // 🔹 DASHBOARD ALUMNO
        // =========================
        [HttpGet("alumno/{idUsuario}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> DashboardAlumno(int idUsuario)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.IdUsuario == idUsuario);

            if (alumno == null) return BadRequest("Alumno no encontrado.");

            var clasesInscritas = await _context.ClaseAlumnos
                .CountAsync(ca => ca.IdAlumno == alumno.IdAlumno);

            // Calificaciones publicadas
            var calificacionesPublicadas = await _context.Calificaciones
                .CountAsync(c =>
                    c.ClaseAlumno.IdAlumno == alumno.IdAlumno &&
                    c.Publicado == true
                );

            // Índice promedio (promedio de las notas publicadas)
            var notasPublicadas = await _context.Calificaciones
                .Where(c =>
                    c.ClaseAlumno.IdAlumno == alumno.IdAlumno &&
                    c.Publicado == true
                )
                .Select(c => c.Nota)
                .ToListAsync();

            decimal indicePromedio = 0;

            if (notasPublicadas.Count > 0)
            {
                // Si tus notas ya están 0-100, esto está perfecto.
                // Si estuvieran 0-10, aquí podrías multiplicar por 10.
                indicePromedio = (decimal)notasPublicadas.Average();
                indicePromedio = Math.Round(indicePromedio, 2);
            }

            return Ok(new
            {
                clasesInscritas,
                calificacionesPublicadas,
                indicePromedio
            });
        }


    }
}
