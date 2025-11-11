using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class FixClaseAlumnos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumnos_Usuarios_UsuarioIdUsuario",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_UsuarioIdUsuario",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "UsuarioIdUsuario",
                table: "Alumnos");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumnos_Usuarios_IdUsuario",
                table: "Alumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumnos_IdUsuario",
                table: "Alumnos");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioIdUsuario",
                table: "Alumnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Alumnos_UsuarioIdUsuario",
                table: "Alumnos",
                column: "UsuarioIdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumnos_Usuarios_UsuarioIdUsuario",
                table: "Alumnos",
                column: "UsuarioIdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
