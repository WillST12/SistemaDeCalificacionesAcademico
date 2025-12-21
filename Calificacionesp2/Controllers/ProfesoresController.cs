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
    [Authorize(Roles = "Admin")]
    public class ProfesoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfesoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================
        // CREAR PROFESOR
        // ============================
        [HttpPost]
        public async Task<IActionResult> CrearProfesor([FromBody] ProfesorDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);
            if (usuario == null || usuario.IdRol != 2)
                return BadRequest("El IdUsuario no corresponde a un profesor.");

            var profesor = new Profesor
            {
                IdUsuario = dto.IdUsuario,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Correo = dto.Correo,
                Especialidad = dto.Especialidad,
                Activo = true
            };

            _context.Profesores.Add(profesor);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Profesor creado correctamente",
                profesor.IdProfesor
            });
        }

        // ============================
        // LISTAR PROFESORES
        // ============================
        [HttpGet]
        public async Task<IActionResult> GetProfesores()
        {
            var profesores = await _context.Profesores
                .Include(p => p.Usuario)
                .OrderBy(p => p.Nombre)
                .ToListAsync();

            return Ok(profesores);
        }

        // ============================
        // OBTENER PROFESOR
        // ============================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfesorPorId(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            return Ok(new
            {
                profesor.Nombre,
                profesor.Apellido,
                profesor.Correo,
                profesor.Especialidad
            });
        }

        // ============================
        // EDITAR PROFESOR
        // ============================
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarProfesor(int id, [FromBody] ProfesorDTO dto)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            profesor.Nombre = dto.Nombre;
            profesor.Apellido = dto.Apellido;
            profesor.Correo = dto.Correo;
            profesor.Especialidad = dto.Especialidad;

            await _context.SaveChangesAsync();
            return Ok("Profesor actualizado correctamente.");
        }

        // ============================
        // DESACTIVAR PROFESOR
        // ============================
        [HttpPut("desactivar/{id}")]
        public async Task<IActionResult> DesactivarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                .Include(c => c.ClaseAlumnos)
                .Where(c =>
                    c.Activo &&
                    c.ProfesorMateria != null &&
                    c.ProfesorMateria.IdProfesor == id
                )
                .ToListAsync();

            if (clases.Any(c => c.ClaseAlumnos.Any()))
            {
                return BadRequest(
                    "No puedes desactivar este profesor porque tiene clases con alumnos inscritos."
                );
            }

            if (clases.Any())
            {
                _context.Clases.RemoveRange(clases);
                await _context.SaveChangesAsync();
            }

            profesor.Activo = false;
            await _context.SaveChangesAsync();

            return Ok("Profesor desactivado correctamente.");
        }

        // ============================
        // REACTIVAR PROFESOR
        // ============================
        [HttpPut("reactivar/{id}")]
        public async Task<IActionResult> ReactivarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            profesor.Activo = true;
            await _context.SaveChangesAsync();

            return Ok("Profesor reactivado correctamente.");
        }

        // =====================================================
        // 🔽 🔽 🔽 NUEVO: ENDPOINTS PARA PROFESOR 🔽 🔽 🔽
        // =====================================================

        // 🔹 Obtener IdProfesor a partir del IdUsuario (login)
        [HttpGet("por-usuario/{idUsuario}")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetProfesorPorUsuario(int idUsuario)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.IdUsuario == idUsuario && p.Activo);

            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            return Ok(new
            {
                profesor.IdProfesor,
                profesor.Nombre,
                profesor.Apellido
            });
        }

        // 🔹 Materias del profesor
        [HttpGet("{idProfesor}/materias")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetMateriasProfesor(int idProfesor)
        {
            var materias = await _context.ProfesorMaterias
                .Where(pm => pm.IdProfesor == idProfesor)
                .Include(pm => pm.Materia)
                .Select(pm => new
                {
                    pm.Materia.IdMateria,
                    pm.Materia.Nombre,
                    pm.Materia.Codigo
                })
                .Distinct()
                .ToListAsync();

            return Ok(materias);
        }

        // 🔹 Clases del profesor
        [HttpGet("{idProfesor}/clases")]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> GetClasesProfesor(int idProfesor)
        {
            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                    .ThenInclude(pm => pm.Materia)
                .Where(c =>
                    c.Activo &&
                    c.ProfesorMateria != null &&
                    c.ProfesorMateria.IdProfesor == idProfesor
                )
                .Select(c => new
                {
                    c.IdClase,
                    Materia = c.ProfesorMateria.Materia.Nombre,
                    CodigoMateria = c.ProfesorMateria.Materia.Codigo,
                    c.Periodo
                })
                .ToListAsync();

            return Ok(clases);
        }
    }
}
