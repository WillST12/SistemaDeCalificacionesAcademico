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
    public class InscripcionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InscripcionesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================
        //  INSCRIBIR ALUMNO (ADMIN)
        // ============================
        [HttpPost("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> InscribirAlumnoAdmin([FromBody] InscribirAlumnoDTO dto)
        {
            var clase = await _context.Clases.FindAsync(dto.IdClase);
            if (clase == null)
                return NotFound("Clase no encontrada.");

            var alumno = await _context.Alumnos.FindAsync(dto.IdAlumno);
            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            // ¿Ya está inscrito?
            bool existe = await _context.ClaseAlumnos
                .AnyAsync(ca => ca.IdClase == dto.IdClase && ca.IdAlumno == dto.IdAlumno);

            if (existe)
                return BadRequest("El alumno ya está inscrito en esta clase.");

            var nuevo = new ClaseAlumno
            {
                IdClase = dto.IdClase,
                IdAlumno = dto.IdAlumno
            };

            _context.ClaseAlumnos.Add(nuevo);
            await _context.SaveChangesAsync();

            return Ok("Alumno inscrito exitosamente.");
        }


        [HttpGet("{idAlumno}")]
        [Authorize(Roles = "Admin,Profesor,Alumno")]
        public async Task<IActionResult> GetClasesPorAlumno(int idAlumno)
        {
            var clases = await _context.ClaseAlumnos
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .Include(ca => ca.Clase.ProfesorMateria.Profesor)
                .Where(ca => ca.IdAlumno == idAlumno)
                .Select(ca => new
                {
                    ca.IdClase,
                    Materia = ca.Clase.ProfesorMateria.Materia.Nombre,
                    Codigo = ca.Clase.ProfesorMateria.Materia.Codigo,
                    Profesor = ca.Clase.ProfesorMateria.Profesor.Nombre + " " + ca.Clase.ProfesorMateria.Profesor.Apellido,
                    ca.Clase.Periodo
                })
                .ToListAsync();

            return Ok(clases);
        }
    }
}
