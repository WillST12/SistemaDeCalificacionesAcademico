using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class FixDBContextRemovingInnecesarythings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumnos_Usuarios_IdUsuario",
                table: "Alumnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_IdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Clases_Materias_MateriaIdMateria",
                table: "Clases");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfesorMaterias_Materias_MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_ProfesorMaterias_MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropIndex(
                name: "IX_Clases_MateriaIdMateria",
                table: "Clases");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_IdUsuario",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "MateriaIdMateria",
                table: "ProfesorMaterias");

            migrationBuilder.DropColumn(
                name: "MateriaIdMateria",
                table: "Clases");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Roles",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_IdUsuario",
                table: "Alumnos",
                column: "IdUsuario",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Alumnos_Usuarios_IdUsuario",
                table: "Alumnos",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_IdClaseAlumno",
                table: "Calificaciones",
                column: "IdClaseAlumno",
                principalTable: "ClaseAlumnos",
                principalColumn: "IdClaseAlumno",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios",
                column: "IdRol",
                principalTable: "Roles",
                principalColumn: "IdRol",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumnos_Usuarios_IdUsuario",
                table: "Alumnos");

            migrationBuilder.DropForeignKey(
                name: "FK_Calificaciones_ClaseAlumnos_IdClaseAlumno",
                table: "Calificaciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_IdUsuario",
                table: "Alumnos");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

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
                name: "IX_Alumnos_IdUsuario",
                table: "Alumnos",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumnos_Usuarios_IdUsuario",
                table: "Alumnos",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios",
                column: "IdRol",
                principalTable: "Roles",
                principalColumn: "IdRol",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
