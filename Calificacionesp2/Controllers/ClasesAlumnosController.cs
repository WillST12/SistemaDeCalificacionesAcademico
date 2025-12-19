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
    [Authorize] // ✅ IMPORTANTE: NO Admin aquí
    public class ClasesAlumnosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClasesAlumnosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST api/ClasesAlumnos (ADMIN)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AgregarAlumno([FromBody] InscribirAlumnoDTO dto)
        {
            var clase = await _context.Clases.FindAsync(dto.IdClase);
            if (clase == null)
                return BadRequest("La clase no existe.");

            var alumno = await _context.Alumnos.FindAsync(dto.IdAlumno);
            if (alumno == null || !alumno.Activo)
                return BadRequest("El alumno no existe o no está activo.");

            bool yaExiste = await _context.ClaseAlumnos
                .AnyAsync(ca => ca.IdClase == dto.IdClase && ca.IdAlumno == dto.IdAlumno);

            if (yaExiste)
                return BadRequest("Este alumno ya está inscrito en esta clase.");

            var inscripcion = new ClaseAlumno
            {
                IdClase = dto.IdClase,
                IdAlumno = dto.IdAlumno
            };

            _context.ClaseAlumnos.Add(inscripcion);
            await _context.SaveChangesAsync();

            return Ok("Alumno inscrito correctamente.");
        }

        // ✅ GET api/ClasesAlumnos/alumno/{idAlumno}
        // Alumno ve SOLO sus clases
        [HttpGet("alumno/{idAlumno}")]
        [Authorize(Roles = "Alumno")]
        public async Task<IActionResult> GetClasesDelAlumno(int idAlumno)
        {
            var clases = await _context.ClaseAlumnos
                .Where(ca => ca.IdAlumno == idAlumno)
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.ProfesorMateria)
                        .ThenInclude(pm => pm.Profesor)
                .Select(ca => new
                {
                    ca.IdClaseAlumno,
                    IdClase = ca.Clase.IdClase,
                    Materia = ca.Clase.ProfesorMateria.Materia.Nombre,
                    CodigoMateria = ca.Clase.ProfesorMateria.Materia.Codigo,
                    Profesor = ca.Clase.ProfesorMateria.Profesor.Nombre + " " +
                               ca.Clase.ProfesorMateria.Profesor.Apellido,
                    Periodo = ca.Clase.Periodo
                })
                .ToListAsync();

            return Ok(clases);
        }

        // GET api/ClasesAlumnos/{idClase} (ADMIN, PROFESOR)
        [HttpGet("{idClase}")]
        [Authorize(Roles = "Admin,Profesor")]
        public async Task<IActionResult> GetAlumnosPorClase(int idClase)
        {
            var alumnos = await _context.ClaseAlumnos
                .Where(ca => ca.IdClase == idClase)
                .Include(ca => ca.Alumno)
                .Select(ca => new
                {
                    ca.IdClaseAlumno,
                    ca.IdClase,
                    ca.IdAlumno,
                    AlumnoNombre = ca.Alumno.Nombre + " " + ca.Alumno.Apellido,
                    Nombre = ca.Alumno.Nombre,
                    Apellido = ca.Alumno.Apellido,
                    Matricula = ca.Alumno.Matricula,
                    Correo = ca.Alumno.Correo
                })
                .ToListAsync();

            return Ok(alumnos);
        }

        // GET api/ClasesAlumnos/inscripciones (ADMIN)
        [HttpGet("inscripciones")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTodasInscripciones()
        {
            var list = await _context.ClaseAlumnos
                .Include(ca => ca.Alumno)
                .Include(ca => ca.Clase)
                    .ThenInclude(c => c.ProfesorMateria)
                        .ThenInclude(pm => pm.Materia)
                .Select(ca => new
                {
                    ca.IdClaseAlumno,
                    ca.IdClase,
                    ca.IdAlumno,
                    AlumnoNombre = ca.Alumno.Nombre + " " + ca.Alumno.Apellido,
                    Materia = ca.Clase.ProfesorMateria.Materia.Nombre,
                    CodigoMateria = ca.Clase.ProfesorMateria.Materia.Codigo,
                    Periodo = ca.Clase.Periodo
                })
                .ToListAsync();

            return Ok(list);
        }

        // DELETE api/ClasesAlumnos (ADMIN)
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Eliminar([FromBody] InscribirAlumnoDTO dto)
        {
            var registro = await _context.ClaseAlumnos
                .FirstOrDefaultAsync(ca => ca.IdClase == dto.IdClase && ca.IdAlumno == dto.IdAlumno);

            if (registro == null)
                return NotFound("El alumno no está inscrito en esta clase.");

            _context.ClaseAlumnos.Remove(registro);
            await _context.SaveChangesAsync();

            return Ok("Alumno removido correctamente.");
        }
    }
}
