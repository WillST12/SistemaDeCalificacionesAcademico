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
    public class ProfesoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfesoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
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
            return Ok("Profesor creado correctamente.");
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfesores()
        {
            var profesores = await _context.Profesores
                .Include(p => p.Usuario)
                .ToListAsync();
            return Ok(profesores);
        }

        [HttpPut("desactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DesactivarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor == null) return NotFound("Profesor no encontrado.");

            profesor.Activo = false;
            await _context.SaveChangesAsync();
            return Ok("Profesor desactivado correctamente.");
        }
    }
}

