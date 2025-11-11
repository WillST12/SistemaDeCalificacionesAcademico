using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class FixDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropIndex(
                name: "IX_Calificaciones_ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropColumn(
                name: "ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.AddColumn<int>(
                name: "MateriaIdMateria",
                table: "ProfesorMaterias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MateriaIdMateria",
                table: "Clases",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfesorMaterias_MateriaIdMateria",
                table: "ProfesorMaterias",
                column: "MateriaIdMateria");

            migrationBuilder.CreateIndex(
                name: "IX_Clases_MateriaIdMateria",
                table: "Clases",
                column: "MateriaIdMateria");

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_IdClaseAlumno",
                table: "Calificaciones",
                column: "IdClaseAlumno");

            migrationBuilder.AddForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_IdClaseAlumno",
                table: "Calificaciones",
                column: "IdClaseAlumno",
                principalTable: "ClaseAlumnos",
                principalColumn: "IdClaseAlumno",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clases_Materias_MateriaIdMateria",
                table: "Clases",
                column: "MateriaIdMateria",
                principalTable: "Materias",
                principalColumn: "IdMateria");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfesorMaterias_Materias_MateriaIdMateria",
                table: "ProfesorMaterias",
                column: "MateriaIdMateria",
                principalTable: "Materias",
                principalColumn: "IdMateria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_IdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Clases_Materias_MateriaIdMateria",
                table: "Clases");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfesorMaterias_Materias_MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropIndex(
                name: "IX_ProfesorMaterias_MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropIndex(
                name: "IX_Clases_MateriaIdMateria",
                table: "Clases");

            migrationBuilder.DropIndex(
                name: "IX_Calificaciones_IdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropColumn(
                name: "MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropColumn(
                name: "MateriaIdMateria",
                table: "Clases");

            migrationBuilder.AddColumn<int>(
                name: "ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones",
                column: "ClaseAlumnoIdClaseAlumno");

            migrationBuilder.AddForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_ClaseAlumnoIdClaseAlumno",
                table: "Calificaciones",
                column: "ClaseAlumnoIdClaseAlumno",
                principalTable: "ClaseAlumnos",
                principalColumn: "IdClaseAlumno",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
