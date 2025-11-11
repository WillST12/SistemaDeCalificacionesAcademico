using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class FixDbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profesores_Usuarios_UsuarioIdUsuario",
                table: "Profesores");

            migrationBuilder.DropIndex(
                name: "IX_Profesores_UsuarioIdUsuario",
                table: "Profesores");

            migrationBuilder.DropColumn(
                name: "UsuarioIdUsuario",
                table: "Profesores");

            migrationBuilder.CreateIndex(
                name: "IX_Profesores_IdUsuario",
                table: "Profesores",
                column: "IdUsuario",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Profesores_Usuarios_IdUsuario",
                table: "Profesores",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profesores_Usuarios_IdUsuario",
                table: "Profesores");

            migrationBuilder.DropIndex(
                name: "IX_Profesores_IdUsuario",
                table: "Profesores");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioIdUsuario",
                table: "Profesores",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Profesores_UsuarioIdUsuario",
                table: "Profesores",
                column: "UsuarioIdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Profesores_Usuarios_UsuarioIdUsuario",
                table: "Profesores",
                column: "UsuarioIdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
