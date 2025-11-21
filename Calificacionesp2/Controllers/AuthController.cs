using Backend.API.Data;
using Backend.API.Models;
using Backend.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // -------------------------
        // Register (Admin only)
        // -------------------------
        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegistrarUsuario([FromBody] RegistrarUsuarioDTO dto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.NombreUsuario == dto.NombreUsuario))
                return BadRequest("El nombre de usuario ya está en uso.");

            var usuario = new Usuario
            {
                NombreUsuario = dto.NombreUsuario,
                ContrasenaHash = dto.Contrasena,
                IdRol = dto.IdRol,
                Activo = true,
                CambiarContrasena = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Usuario registrado correctamente.",
                usuario.IdUsuario,
                usuario.NombreUsuario,
                usuario.IdRol,
                usuario.CambiarContrasena
            });
        }

        // -------------------------
        // Login
        // -------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            // Buscar usuario por NombreUsuario
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario && u.Activo == true);

            if (usuario == null)
                return Unauthorized("Credenciales inválidas.");

            if (usuario.ContrasenaHash != dto.Contrasena)
                return Unauthorized("Contraseña incorrecta.");

            var claims = new[]
            {
                new Claim("idUsuario", usuario.IdUsuario.ToString()),
                new Claim(ClaimTypes.Role, usuario.Rol.Nombre)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                rol = usuario.Rol.Nombre,
                debeCambiarContrasena = usuario.CambiarContrasena
            });
        }

        // -------------------------
        // Solicitar recuperación (por correo de Alumno/Profesor -> vincula a Usuario)
        // -------------------------
        [HttpPost("solicitar-recuperacion")]
        public async Task<IActionResult> SolicitarRecuperacion([FromBody] RecuperacionRequest dto)
        {
            // 1. Buscar correo en alumnos
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.Correo == dto.Correo);

            // 2. Si no es alumno, buscar profesor
            var profesor = alumno == null
                ? await _context.Profesores.FirstOrDefaultAsync(p => p.Correo == dto.Correo)
                : null;

            if (alumno == null && profesor == null)
                return NotFound("No existe un usuario con ese correo.");

            // 3. Obtener IdUsuario
            int idUsuario = alumno != null ? alumno.IdUsuario : profesor.IdUsuario;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

            if (usuario == null)
                return NotFound("El usuario no está vinculado correctamente.");

            // 4. Generar código
            var codigo = new Random().Next(100000, 999999).ToString();

            usuario.CodigoRecuperacion = codigo;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Código generado correctamente.",
                codigo // SOLO para pruebas
            });
        }

        [HttpPost("verificar-codigo")]
        public async Task<IActionResult> VerificarCodigo([FromBody] VerificarCodigoDTO dto)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.Correo == dto.Correo);

            var profesor = alumno == null
                ? await _context.Profesores.FirstOrDefaultAsync(p => p.Correo == dto.Correo)
                : null;

            if (alumno == null && profesor == null)
                return NotFound("No existe un usuario con ese correo.");

            int idUsuario = alumno != null ? alumno.IdUsuario : profesor.IdUsuario;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

            if (usuario == null)
                return NotFound("Usuario no vinculado.");

            if (usuario.CodigoRecuperacion != dto.Codigo)
                return BadRequest("El código es incorrecto.");

            return Ok(new { message = "Código verificado correctamente." });
        }


        // pequeña helper para evitar repetición en la verificación de profesor al obtener IdUsuario
        private int professorHelper(Profesor professor)
        {
            return professor != null ? professor.IdUsuario : 0;
        }


        [HttpPost("restablecer-password")]
        public async Task<IActionResult> RestablecerPassword([FromBody] RestablecerPasswordDTO dto)
        {
            var alumno = await _context.Alumnos
                .FirstOrDefaultAsync(a => a.Correo == dto.Correo);

            var profesor = alumno == null
                ? await _context.Profesores.FirstOrDefaultAsync(p => p.Correo == dto.Correo)
                : null;

            if (alumno == null && profesor == null)
                return NotFound("No existe un usuario con ese correo.");

            int idUsuario = alumno != null ? alumno.IdUsuario : profesor.IdUsuario;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

            if (usuario == null)
                return NotFound("Usuario no vinculado.");

            if (string.IsNullOrEmpty(usuario.CodigoRecuperacion))
                return BadRequest("Debe verificar el código antes de cambiar la contraseña.");

            usuario.ContrasenaHash = dto.NuevaContrasena;
            usuario.CodigoRecuperacion = null;
            usuario.CambiarContrasena = false;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña restablecida con éxito." });
        }


        // -------------------------
        // Cambiar contraseña (usuario autenticado)
        // -------------------------
        [HttpPost("cambiar-contrasena")]
        [Authorize]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaDTO dto)
        {
            var claim = User.FindFirst("idUsuario");
            if (claim == null) return Unauthorized();

            if (!int.TryParse(claim.Value, out int idUsuario)) return Unauthorized();

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == idUsuario && u.Activo == true);
            if (usuario == null) return Unauthorized("Usuario no encontrado.");

            if (usuario.ContrasenaHash != dto.ContrasenaActual)
                return Unauthorized("La contraseña actual es incorrecta.");

            usuario.ContrasenaHash = dto.NuevaContrasena;
            usuario.CambiarContrasena = false;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña actualizada correctamente." });
        }

        // -------------------------
        // Me (info del usuario)
        // -------------------------
        [HttpGet("MiPersona")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var claim = User.FindFirst("idUsuario");
            if (claim == null) return Unauthorized();
            if (!int.TryParse(claim.Value, out int userId)) return Unauthorized();

            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.IdUsuario == userId);

            if (usuario == null) return NotFound();

            return Ok(new
            {
                usuario.IdUsuario,
                usuario.NombreUsuario,
                IdRol = usuario.IdRol,
                Rol = usuario.Rol?.Nombre,
                usuario.CambiarContrasena,
                usuario.Activo
            });
        }

    }
}
