using Microsoft.EntityFrameworkCore.Migrations;

namespace webapi.Migrations
{
    public partial class ChapterUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Chapters",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255) CHARACTER SET utf8mb4", nullable: false),
                    FunficId = table.Column<string>(type: "varchar(255) CHARACTER SET utf8mb4", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<int>(type: "int", maxLength: 50, nullable: false),
                    Text = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chapters_Funfics_FunficId",
                        column: x => x.FunficId,
                        principalTable: "Funfics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_FunficId",
                table: "Chapters",
                column: "FunficId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chapters");
        }
    }
}
