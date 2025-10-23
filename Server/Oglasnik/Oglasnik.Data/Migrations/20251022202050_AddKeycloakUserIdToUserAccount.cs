using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oglasnik.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddKeycloakUserIdToUserAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KeycloakUserId",
                table: "UserAccounts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KeycloakUserId",
                table: "UserAccounts");
        }
    }
}
