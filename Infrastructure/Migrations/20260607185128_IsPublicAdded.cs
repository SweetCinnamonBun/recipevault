using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IsPublicAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Recipes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1d0ae8e4-a2fc-4e99-bff7-5a153884c1cc",
                column: "ConcurrencyStamp",
                value: "c3542f2d-12ef-415d-b2cb-143966aae550");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af18fc4c-7c5f-42a0-b98e-f8653c0a1fbb",
                column: "ConcurrencyStamp",
                value: "9ad3d97e-9486-4963-84f7-620fa88bc5b3");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Recipes");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1d0ae8e4-a2fc-4e99-bff7-5a153884c1cc",
                column: "ConcurrencyStamp",
                value: null);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "af18fc4c-7c5f-42a0-b98e-f8653c0a1fbb",
                column: "ConcurrencyStamp",
                value: null);
        }
    }
}
