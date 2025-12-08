using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class Calificacionfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Publicado",
                table: "Calificaciones",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Publicado",
                table: "Calificaciones");
        }
    }
}
