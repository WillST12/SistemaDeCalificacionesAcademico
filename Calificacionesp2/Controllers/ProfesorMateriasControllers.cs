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
    public class ProfesorMateriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfesorMateriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AsignarMateria([FromBody] ProfesorMateriaDTO dto)
        {
            var profesor = await _context.Profesores.FindAsync(dto.IdProfesor);
            var materia = await _context.Materias.FindAsync(dto.IdMateria);

            if (profesor == null || materia == null)
                return BadRequest("Profesor o materia inválidos.");

            var asignacionExistente = await _context.ProfesorMaterias
                .FirstOrDefaultAsync(pm => pm.IdProfesor == dto.IdProfesor && pm.IdMateria == dto.IdMateria);

            if (asignacionExistente != null)
            {
                // si ya existe devolvemos su id
                return Ok(new { idProfesorMateria = asignacionExistente.IdProfesorMateria });
            }

            var asignacion = new ProfesorMateria
            {
                IdProfesor = dto.IdProfesor,
                IdMateria = dto.IdMateria
            };

            _context.ProfesorMaterias.Add(asignacion);
            await _context.SaveChangesAsync();

            return Ok(new { idProfesorMateria = asignacion.IdProfesorMateria });
        }


        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfesorMaterias()
        {
            var list = await _context.ProfesorMaterias
                .Include(pm => pm.Profesor)
                .Include(pm => pm.Materia)
                .Select(pm => new {
                    pm.IdProfesorMateria,
                    pm.IdProfesor,
                    Profesor = pm.Profesor.Nombre + " " + pm.Profesor.Apellido,
                    pm.IdMateria,
                    Materia = pm.Materia.Nombre
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/ProfesorMaterias
        
        // ✅ Listar materias asignadas a un profesor
        [HttpGet("profesor/{idProfesor}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> GetMateriasPorProfesor(int idProfesor)
        {
            var materias = await _context.ProfesorMaterias
                .Include(pm => pm.Materia)
                .Where(pm => pm.IdProfesor == idProfesor)
                .Select(pm => new
                {
                    pm.Materia.IdMateria,
                    pm.Materia.Nombre,
                    pm.Materia.Codigo
                })
                .ToListAsync();

            return Ok(materias);
        }

        // ✅ Eliminar asignación
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> QuitarMateria([FromBody] ProfesorMateriaDTO dto)
        {
            var asignacion = await _context.ProfesorMaterias
                .FirstOrDefaultAsync(pm => pm.IdProfesor == dto.IdProfesor && pm.IdMateria == dto.IdMateria);

            if (asignacion == null)
                return NotFound("La asignación no existe.");

            _context.ProfesorMaterias.Remove(asignacion);
            await _context.SaveChangesAsync();

            return Ok("Asignación eliminada correctamente.");
        }
    }
}
