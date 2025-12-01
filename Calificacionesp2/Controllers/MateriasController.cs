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
    public class MateriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MateriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMaterias()
        {
            var materias = await _context.Materias.ToListAsync();
            return Ok(materias);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CrearMateria([FromBody] MateriaDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) ||
                string.IsNullOrWhiteSpace(dto.Codigo) ||
                string.IsNullOrWhiteSpace(dto.Descripcion))
            {
                return BadRequest("Todos los campos son obligatorios.");
            }

            var materia = new Materia
            {
                Nombre = dto.Nombre,
                Codigo = dto.Codigo,
                Descripcion = dto.Descripcion,
                Activo = true
            };

            _context.Materias.Add(materia);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Materia creada correctamente." });
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditarMateria(int id, [FromBody] MateriaDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) ||
                string.IsNullOrWhiteSpace(dto.Codigo) ||
                string.IsNullOrWhiteSpace(dto.Descripcion))
            {
                return BadRequest("Todos los campos son obligatorios.");
            }

            var materia = await _context.Materias.FindAsync(id);
            if (materia == null) return NotFound("Materia no encontrada.");

            materia.Nombre = dto.Nombre;
            materia.Codigo = dto.Codigo;
            materia.Descripcion = dto.Descripcion;

            await _context.SaveChangesAsync();

            return Ok("Materia actualizada correctamente.");
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMateriaPorId(int id)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null) return NotFound("Materia no encontrada.");

            return Ok(materia);
        }

        [HttpPut("desactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DesactivarMateria(int id)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null) return NotFound("Materia no encontrada.");

            materia.Activo = false;
            await _context.SaveChangesAsync();
            return Ok("Materia desactivada correctamente.");
        }
    }
}
