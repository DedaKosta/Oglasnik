using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oglasnik.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUsernameFromUserAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "UserAccounts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "UserAccounts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
