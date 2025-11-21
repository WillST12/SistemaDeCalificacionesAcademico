using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Calificacionesp2.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Codigo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CodigoExpira",
                table: "Usuarios",
                newName: "ExpiracionCodigo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExpiracionCodigo",
                table: "Usuarios",
                newName: "CodigoExpira");
        }
    }
}
