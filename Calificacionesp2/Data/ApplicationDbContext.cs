using Microsoft.EntityFrameworkCore;
using Backend.API.Models;

namespace Backend.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Alumno> Alumnos { get; set; }
        public DbSet<Profesor> Profesores { get; set; }
        public DbSet<Materia> Materias { get; set; }
        public DbSet<ProfesorMateria> ProfesorMaterias { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<ClaseAlumno> ClaseAlumnos { get; set; }
        public DbSet<Calificacion> Calificaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Roles iniciales
            modelBuilder.Entity<Rol>().HasData(
                new Rol { IdRol = 1, Nombre = "Admin" },
                new Rol { IdRol = 2, Nombre = "Profesor" },
                new Rol { IdRol = 3, Nombre = "Alumno" }
            );

            // Usuario → Rol
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany()
                .HasForeignKey(u => u.IdRol)
                .OnDelete(DeleteBehavior.Restrict);

            // Profesor → Usuario
            modelBuilder.Entity<Profesor>()
                .HasOne(p => p.Usuario)
                .WithOne()
                .HasForeignKey<Profesor>(p => p.IdUsuario)
                .OnDelete(DeleteBehavior.Restrict);

            // Alumno → Usuario
            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Usuario)
                .WithOne()
                .HasForeignKey<Alumno>(a => a.IdUsuario)
                .OnDelete(DeleteBehavior.Restrict);

            // ProfesorMateria
            modelBuilder.Entity<ProfesorMateria>()
                .HasOne(pm => pm.Profesor)
                .WithMany(p => p.ProfesorMaterias)
                .HasForeignKey(pm => pm.IdProfesor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProfesorMateria>()
                .HasOne(pm => pm.Materia)
                .WithMany()
                .HasForeignKey(pm => pm.IdMateria)
                .OnDelete(DeleteBehavior.Restrict);

            // Clase → Profesor/Materia
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Profesor)
                .WithMany(p => p.Clases)
                .HasForeignKey(c => c.IdProfesor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Materia)
                .WithMany()
                .HasForeignKey(c => c.IdMateria)
                .OnDelete(DeleteBehavior.Restrict);

            // ClaseAlumno
            modelBuilder.Entity<ClaseAlumno>()
                .HasOne(ca => ca.Clase)
                .WithMany(c => c.ClaseAlumnos)
                .HasForeignKey(ca => ca.IdClase)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClaseAlumno>()
                .HasOne(ca => ca.Alumno)
                .WithMany(a => a.ClaseAlumnos)
                .HasForeignKey(ca => ca.IdAlumno)
                .OnDelete(DeleteBehavior.Restrict);

            // Calificación
            modelBuilder.Entity<Calificacion>()
                .HasOne(c => c.ClaseAlumno)
                .WithMany(ca => ca.Calificaciones)
                .HasForeignKey(c => c.IdClaseAlumno)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision
            modelBuilder.Entity<Calificacion>()
                .Property(c => c.Nota)
                .HasPrecision(5, 2);
        }
    }
}
