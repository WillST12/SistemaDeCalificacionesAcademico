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
        // DESACTIVAR PROFESOR (LÓGICA FINAL)
        // ============================
        [HttpPut("desactivar/{id}")]
        public async Task<IActionResult> DesactivarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null)
                return NotFound("Profesor no encontrado.");

            // 🔍 Clases del profesor
            var clases = await _context.Clases
                .Include(c => c.ProfesorMateria)
                .Include(c => c.ClaseAlumnos)
                .Where(c =>
                    c.Activo &&
                    c.ProfesorMateria != null &&
                    c.ProfesorMateria.IdProfesor == id
                )
                .ToListAsync();

            // ❌ Si alguna clase tiene alumnos → NO desactivar
            if (clases.Any(c => c.ClaseAlumnos.Any()))
            {
                return BadRequest(
                    "No puedes desactivar este profesor porque tiene clases con alumnos inscritos. Reasigna las clases primero."
                );
            }

            // 🗑 Eliminar clases SIN alumnos
            if (clases.Any())
            {
                _context.Clases.RemoveRange(clases);
                await _context.SaveChangesAsync();
            }

            // 🔴 Desactivar profesor
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
    }
}
