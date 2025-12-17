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
    public class AlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlumnosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CrearAlumno([FromBody] AlumnoDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(dto.IdUsuario);

            if (usuario == null)
                return BadRequest("El usuario no existe.");

            if (usuario.IdRol != 3)
                return BadRequest("El usuario no tiene rol de Alumno.");

            var alumno = new Alumno
            {
                IdUsuario = dto.IdUsuario,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                FechaNac = dto.FechaNac,
                Matricula = dto.Matricula,
                Correo = dto.Correo,
                Activo = true
            };

            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return Ok(new { alumno.IdAlumno });
        }

        [HttpGet]
        public async Task<IActionResult> GetAlumnos()
        {
            var alumnos = await _context.Alumnos
                .Include(a => a.Usuario)
                .OrderBy(a => a.Nombre)
                .ToListAsync();

            return Ok(alumnos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlumnoPorId(int id)
        {
            var alumno = await _context.Alumnos
                .Include(a => a.Usuario)
                .FirstOrDefaultAsync(a => a.IdAlumno == id);

            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            return Ok(alumno);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarAlumno(int id, [FromBody] AlumnoDTO dto)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            alumno.Nombre = dto.Nombre;
            alumno.Apellido = dto.Apellido;
            alumno.FechaNac = dto.FechaNac;
            alumno.Matricula = dto.Matricula;
            alumno.Correo = dto.Correo;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("desactivar/{id}")]
        public async Task<IActionResult> DesactivarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound("Alumno no encontrado.");

            alumno.Activo = false;
            await _context.SaveChangesAsync();
            return Ok("Alumno desactivado Correctamente");
        }

        [HttpPut("reactivar/{id}")]
        public async Task<IActionResult> ReactivarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound();

            alumno.Activo = true;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
