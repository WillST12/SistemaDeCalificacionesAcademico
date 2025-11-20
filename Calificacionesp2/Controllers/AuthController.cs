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

        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegistrarUsuario([FromBody] RegistrarUsuarioDTO dto)
        {
            // Verifica si ya existe
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

        // ============================================================
        // 2. LOGIN - Retorna JWT y si debe cambiar contraseña
        // ============================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario && u.Activo == true);

            if (usuario == null)
                return Unauthorized("Credenciales inválidas.");

            if (usuario.ContrasenaHash != dto.Contrasena)
                return Unauthorized("Contraseña incorrecta.");

            // Crear JWT
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

            // SIEMPRE DEVOLVEMOS TOKEN
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                rol = usuario.Rol.Nombre,
                debeCambiarContrasena = usuario.CambiarContrasena
            });
        }



        [HttpPost("cambiar-contrasena")]
        [Authorize]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaDTO dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario && u.Activo == true);

            if (usuario == null)
                return Unauthorized("Usuario no encontrado.");

            if (usuario.ContrasenaHash != dto.ContrasenaActual)
                return Unauthorized("La contraseña actual es incorrecta.");

            usuario.ContrasenaHash = dto.NuevaContrasena;
            usuario.CambiarContrasena = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña actualizada correctamente." });
        }

        [HttpGet("MiPersona")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var claim = User.FindFirst("idUsuario");
            if (claim == null) return Unauthorized();

            if (!int.TryParse(claim.Value, out int userId))
                return Unauthorized();

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

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("API funcionando correctamente");
        }


    }
}
