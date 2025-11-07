using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class FirstMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Materias",
                columns: table => new
                {
                    IdMateria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materias", x => x.IdMateria);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    IdRol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.IdRol);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ContrasenaHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdRol = table.Column<int>(type: "int", nullable: false),
                    RolIdRol = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Roles_RolIdRol",
                        column: x => x.RolIdRol,
                        principalTable: "Roles",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alumnos",
                columns: table => new
                {
                    IdAlumno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FechaNac = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Matricula = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    UsuarioIdUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alumnos", x => x.IdAlumno);
                    table.ForeignKey(
                        name: "FK_Alumnos_Usuarios_UsuarioIdUsuario",
                        column: x => x.UsuarioIdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profesores",
                columns: table => new
                {
                    IdProfesor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Especialidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    UsuarioIdUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profesores", x => x.IdProfesor);
                    table.ForeignKey(
                        name: "FK_Profesores_Usuarios_UsuarioIdUsuario",
                        column: x => x.UsuarioIdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clases",
                columns: table => new
                {
                    IdClase = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdMateria = table.Column<int>(type: "int", nullable: false),
                    IdProfesor = table.Column<int>(type: "int", nullable: false),
                    Periodo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clases", x => x.IdClase);
                    table.ForeignKey(
                        name: "FK_Clases_Materias_IdMateria",
                        column: x => x.IdMateria,
                        principalTable: "Materias",
                        principalColumn: "IdMateria",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clases_Profesores_IdProfesor",
                        column: x => x.IdProfesor,
                        principalTable: "Profesores",
                        principalColumn: "IdProfesor",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProfesorMaterias",
                columns: table => new
                {
                    IdProfesorMateria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdProfesor = table.Column<int>(type: "int", nullable: false),
                    IdMateria = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfesorMaterias", x => x.IdProfesorMateria);
                    table.ForeignKey(
                        name: "FK_ProfesorMaterias_Materias_IdMateria",
                        column: x => x.IdMateria,
                        principalTable: "Materias",
                        principalColumn: "IdMateria",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfesorMaterias_Profesores_IdProfesor",
                        column: x => x.IdProfesor,
                        principalTable: "Profesores",
                        principalColumn: "IdProfesor",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClaseAlumnos",
                columns: table => new
                {
                    IdClaseAlumno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdClase = table.Column<int>(type: "int", nullable: false),
                    IdAlumno = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaseAlumnos", x => x.IdClaseAlumno);
                    table.ForeignKey(
                        name: "FK_ClaseAlumnos_Alumnos_IdAlumno",
                        column: x => x.IdAlumno,
                        principalTable: "Alumnos",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClaseAlumnos_Clases_IdClase",
                        column: x => x.IdClase,
                        principalTable: "Clases",
                        principalColumn: "IdClase",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Calificaciones",
                columns: table => new
                {
                    IdCalificacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdClaseAlumno = table.Column<int>(type: "int", nullable: false),
                    ClaseAlumnoIdClaseAlumno = table.Column<int>(type: "int", nullable: false),
                    Nota = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calificaciones", x => x.IdCalificacion);
                    table.ForeignKey(
                        name: "FK_Calificaciones_ClaseAlumnos_ClaseAlumnoIdClaseAlumno",
                        column: x => x.ClaseAlumnoIdClaseAlumno,
                        principalTable: "ClaseAlumnos",
                        principalColumn: "IdClaseAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "IdRol", "Nombre" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Profesor" },
                    { 3, "Alumno" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_UsuarioIdUsuario",
                table: "Alumnos",
                column: "UsuarioIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones",
                column: "ClaseAlumnoIdClaseAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_ClaseAlumnos_IdAlumno",
                table: "ClaseAlumnos",
                column: "IdAlumno");

            migrationBuilder.CreateIndex(
                name: "IX_ClaseAlumnos_IdClase",
                table: "ClaseAlumnos",
                column: "IdClase");

            migrationBuilder.CreateIndex(
                name: "IX_Clases_IdMateria",
                table: "Clases",
                column: "IdMateria");

            migrationBuilder.CreateIndex(
                name: "IX_Clases_IdProfesor",
                table: "Clases",
                column: "IdProfesor");

            migrationBuilder.CreateIndex(
                name: "IX_Profesores_UsuarioIdUsuario",
                table: "Profesores",
                column: "UsuarioIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_ProfesorMaterias_IdMateria",
                table: "ProfesorMaterias",
                column: "IdMateria");

            migrationBuilder.CreateIndex(
                name: "IX_ProfesorMaterias_IdProfesor",
                table: "ProfesorMaterias",
                column: "IdProfesor");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_RolIdRol",
                table: "Usuarios",
                column: "RolIdRol");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Calificaciones");

            migrationBuilder.DropTable(
                name: "ProfesorMaterias");

            migrationBuilder.DropTable(
                name: "ClaseAlumnos");

            migrationBuilder.DropTable(
                name: "Alumnos");

            migrationBuilder.DropTable(
                name: "Clases");

            migrationBuilder.DropTable(
                name: "Materias");

            migrationBuilder.DropTable(
                name: "Profesores");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
