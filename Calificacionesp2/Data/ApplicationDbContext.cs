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

        // Tablas principales
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

            // ✅ Carga inicial de Roles
            modelBuilder.Entity<Rol>().HasData(
                new Rol { IdRol = 1, Nombre = "Admin" },
                new Rol { IdRol = 2, Nombre = "Profesor" },
                new Rol { IdRol = 3, Nombre = "Alumno" }
            );

            // ✅ Relación N:M Profesor - Materia
            modelBuilder.Entity<ProfesorMateria>()
                .HasOne(pm => pm.Profesor)
                .WithMany(p => p.ProfesorMaterias)
                .HasForeignKey(pm => pm.IdProfesor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProfesorMateria>()
                .HasOne(pm => pm.Materia)
                .WithMany(m => m.ProfesorMaterias)
                .HasForeignKey(pm => pm.IdMateria)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ Relación N:M Clase - Alumno
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

            // ✅ Clase → Profesor
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Profesor)
                .WithMany(p => p.Clases)
                .HasForeignKey(c => c.IdProfesor)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ Clase → Materia
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Materia)
                .WithMany(m => m.Clases)
                .HasForeignKey(c => c.IdMateria)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ Precisión de Nota
            modelBuilder.Entity<Calificacion>()
                .Property(c => c.Nota)
                .HasPrecision(5, 2);
        }
    }
}
