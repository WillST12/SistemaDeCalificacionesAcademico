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
    public class ClasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Crear clase
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CrearClase([FromBody] ClaseDTO dto)
        {
            var profesorMateria = await _context.ProfesorMaterias
                .Include(pm => pm.Profesor)
                .Include(pm => pm.Materia)
                .FirstOrDefaultAsync(pm => pm.IdProfesorMateria == dto.IdProfesorMateria);

            if (profesorMateria == null)
                return BadRequest("La relación Profesor-Materia no existe.");

            // 🔴 VALIDACIÓN CLAVE
            if (!profesorMateria.Materia.Activo)
                return BadRequest("No puedes crear clases con una materia desactivada.");

            if (!profesorMateria.Profesor.Activo) {

                return BadRequest("No puedes crear clases con un profesor inactivo.");
            
            }

            var clase = new Clase
            {
                IdProfesorMateria = dto.IdProfesorMateria,
                Periodo = dto.Periodo,
                Activo = dto.Activo
            };

            _context.Clases.Add(clase);
            await _context.SaveChangesAsync();

            return Ok($"Clase creada para {profesorMateria.Materia.Nombre} con el profesor {profesorMateria.Profesor.Nombre}.");
        }

        
        [HttpGet]
        [Authorize(Roles = "Admin,Profesor,Alumno")]
        public async Task<IActionResult> GetClases()
        {
            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                    .ThenInclude(pm => pm.Profesor)
                .Include(c => c.ProfesorMateria.Materia)
                .Select(c => new
                {
                    c.IdClase,
                    c.Periodo,
                    c.Activo,
                    Profesor = c.ProfesorMateria.Profesor.Nombre + " " + c.ProfesorMateria.Profesor.Apellido,
                    Materia = c.ProfesorMateria.Materia.Nombre
                })
                .ToListAsync();

            return Ok(clases);
        }

      //ESCRIBI MAL EL COMMIT ESTO ES PARA ARREGLARLO
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetClase(int id)
        {
            var clase = await _context.Clases
                .Include(c => c.ProfesorMateria)
                .ThenInclude(pm => pm.Profesor)
                .Include(c => c.ProfesorMateria.Materia)
                .FirstOrDefaultAsync(c => c.IdClase == id);

            if (clase == null)
                return NotFound("Clase no encontrada.");

            return Ok(new
            {
                clase.IdClase,
                clase.Periodo,
                clase.IdProfesorMateria,
                Profesor = clase.ProfesorMateria.Profesor.Nombre + " " + clase.ProfesorMateria.Profesor.Apellido,
                Materia = clase.ProfesorMateria.Materia.Nombre
            });
        }

        // ✅ Editar clase
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditarClase(int id, [FromBody] ClaseDTO dto)
        {
            var clase = await _context.Clases.FindAsync(id);
            if (clase == null)
                return NotFound("Clase no encontrada.");

            var profesorMateria = await _context.ProfesorMaterias
                .FirstOrDefaultAsync(pm => pm.IdProfesorMateria == dto.IdProfesorMateria);

            if (profesorMateria == null)
                return BadRequest("Relación Profesor-Materia inválida.");

            clase.IdProfesorMateria = dto.IdProfesorMateria;
            clase.Periodo = dto.Periodo;
            clase.Activo = dto.Activo;

            await _context.SaveChangesAsync();
            return Ok("Clase actualizada correctamente.");
        }

        // ✅ Eliminar clase
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EliminarClase(int id)
        {
            var clase = await _context.Clases.FindAsync(id);
            if (clase == null)
                return NotFound("Clase no encontrada.");

            _context.Clases.Remove(clase);
            await _context.SaveChangesAsync();

            return Ok("Clase eliminada correctamente.");
        }

        [HttpGet("{idClase}/alumnos")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> GetAlumnosDeClase(int idClase)
        {
            var alumnos = await _context.ClaseAlumnos
                .Where(ca => ca.IdClase == idClase)
                .Include(ca => ca.Alumno)
                .Select(ca => new {
                    ca.IdClaseAlumno,
                    ca.Alumno.IdAlumno,
                    ca.Alumno.Nombre,
                    ca.Alumno.Apellido,
                    ca.Alumno.Matricula
                })
                .ToListAsync();

            return Ok(alumnos);
        }

        // GET api/Clases/profesor/{idProfesor}
        [HttpGet("profesor/usuario/{idUsuario}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetClasesProfesorPorUsuario(int idUsuario)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.IdUsuario == idUsuario && p.Activo);

            if (profesor == null)
                return BadRequest("Profesor no encontrado para este usuario.");

            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                    .ThenInclude(pm => pm.Materia)
                .Where(c =>
                    c.Activo &&
                    c.ProfesorMateria.IdProfesor == profesor.IdProfesor
                )
                .Select(c => new
                {
                    c.IdClase,
                    c.Periodo,
                    materia = c.ProfesorMateria.Materia.Nombre
                })
                .ToListAsync();

            return Ok(clases);
        }


    }
}
