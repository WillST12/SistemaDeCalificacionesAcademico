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
    [Authorize]
    public class MateriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MateriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // LISTAR MATERIAS (TODAS)
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetMaterias()
        {
            var materias = await _context.Materias
                .OrderBy(m => m.Nombre)
                .ToListAsync();

            return Ok(materias);
        }

        // =========================
        // OBTENER POR ID
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMateriaPorId(int id)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null)
                return NotFound("Materia no encontrada.");

            return Ok(materia);
        }

        // =========================
        // CREAR
        // =========================
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

            return Ok("Materia creada correctamente.");
        }

        // =========================
        // EDITAR
        // =========================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditarMateria(int id, [FromBody] MateriaDTO dto)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null)
                return NotFound("Materia no encontrada.");

            materia.Nombre = dto.Nombre;
            materia.Codigo = dto.Codigo;
            materia.Descripcion = dto.Descripcion;

            await _context.SaveChangesAsync();
            return Ok("Materia actualizada correctamente.");
        }

        // =========================
        // DESACTIVAR (SOFT DELETE)
        // =========================
        [HttpPut("desactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DesactivarMateria(int id)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null)
                return NotFound("Materia no encontrada.");

            materia.Activo = false;
            await _context.SaveChangesAsync();

            return Ok("Materia desactivada correctamente.");
        }

        // =========================
        // REACTIVAR
        // =========================
        [HttpPut("reactivar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivarMateria(int id)
        {
            var materia = await _context.Materias.FindAsync(id);
            if (materia == null)
                return NotFound("Materia no encontrada.");

            materia.Activo = true;
            await _context.SaveChangesAsync();

            return Ok("Materia reactivada correctamente.");
        }
    }
}
