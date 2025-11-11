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

        /// <summary>
        /// Inscribir un alumno en una clase buscando por el código de materia
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Alumno,Admin")]
        public async Task<IActionResult> InscribirAlumno([FromBody] InscribirAlumnoDTO dto)
        {
            // Buscar la materia por su código
            var materia = await _context.Materias
                .FirstOrDefaultAsync(m => m.Codigo == dto.CodigoMateria);

            if (materia == null)
                return NotFound("No se encontró ninguna materia con ese código.");

            // Buscar la clase asociada a esa materia
            var clase = await _context.Clases
                .Include(c => c.Materia)
                .FirstOrDefaultAsync(c => c.IdMateria == materia.IdMateria);

            if (clase == null)
                return NotFound("No hay clases registradas para esa materia.");

            // Verificar el alumno
            var alumno = await _context.Alumnos.FindAsync(dto.IdAlumno);
            if (alumno == null)
                return BadRequest("Alumno no válido.");

            // Verificar si ya está inscrito
            bool existe = await _context.ClaseAlumnos
                .AnyAsync(ca => ca.IdAlumno == dto.IdAlumno && ca.IdClase == clase.IdClase);

            if (existe)
                return BadRequest("El alumno ya está inscrito en esta clase.");

            // Crear la inscripción
            var claseAlumno = new ClaseAlumno
            {
                IdAlumno = dto.IdAlumno,
                IdClase = clase.IdClase
            };

            _context.ClaseAlumnos.Add(claseAlumno);
            await _context.SaveChangesAsync();

            return Ok($"Alumno inscrito correctamente en la materia '{materia.Nombre}'.");
        }

        /// <summary>
        /// Obtener todas las clases en las que está inscrito un alumno
        /// </summary>
        [HttpGet("{idAlumno}")]
        [Authorize(Roles = "Alumno,Profesor,Admin")]
        public async Task<IActionResult> GetInscripcionesPorAlumno(int idAlumno)
        {
            var clases = await _context.ClaseAlumnos
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.Materia)
                .Include(ca => ca.Clase.Profesor)
                .Where(ca => ca.IdAlumno == idAlumno)
                .Select(ca => new
                {
                    ca.IdClase,
                    Materia = ca.Clase.Materia.Nombre,
                    CodigoMateria = ca.Clase.Materia.Codigo,
                    Profesor = ca.Clase.Profesor.Nombre + " " + ca.Clase.Profesor.Apellido,
                    ca.Clase.Periodo
                })
                .ToListAsync();

            return Ok(clases);
        }
    }
}
