using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BrewControl.Api.Migrations
{
    /// <inheritdoc />
    public partial class InicialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cervejas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Estilo = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cervejas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tanques",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Capacidade = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tanques", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ParametrosFermentativos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CervejaId = table.Column<int>(type: "integer", nullable: false),
                    TemperaturaMinima = table.Column<decimal>(type: "numeric", nullable: false),
                    TemperaturaMaxima = table.Column<decimal>(type: "numeric", nullable: false),
                    PhMinimo = table.Column<decimal>(type: "numeric", nullable: false),
                    PhMaximo = table.Column<decimal>(type: "numeric", nullable: false),
                    ExtratoPMinimo = table.Column<decimal>(type: "numeric", nullable: false),
                    ExtratoPMaximo = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParametrosFermentativos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParametrosFermentativos_Cervejas_CervejaId",
                        column: x => x.CervejaId,
                        principalTable: "Cervejas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RegistrosFermentativos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CervejaId = table.Column<int>(type: "integer", nullable: false),
                    TanqueId = table.Column<int>(type: "integer", nullable: false),
                    NumeroDeLote = table.Column<string>(type: "text", nullable: false),
                    Temperatura = table.Column<decimal>(type: "numeric", nullable: false),
                    Ph = table.Column<decimal>(type: "numeric", nullable: false),
                    Extrato = table.Column<decimal>(type: "numeric", nullable: false),
                    Observacoes = table.Column<string>(type: "text", nullable: true),
                    Classificacao = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosFermentativos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosFermentativos_Cervejas_CervejaId",
                        column: x => x.CervejaId,
                        principalTable: "Cervejas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RegistrosFermentativos_Tanques_TanqueId",
                        column: x => x.TanqueId,
                        principalTable: "Tanques",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ParametrosFermentativos_CervejaId",
                table: "ParametrosFermentativos",
                column: "CervejaId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosFermentativos_CervejaId",
                table: "RegistrosFermentativos",
                column: "CervejaId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosFermentativos_TanqueId",
                table: "RegistrosFermentativos",
                column: "TanqueId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ParametrosFermentativos");

            migrationBuilder.DropTable(
                name: "RegistrosFermentativos");

            migrationBuilder.DropTable(
                name: "Cervejas");

            migrationBuilder.DropTable(
                name: "Tanques");
        }
    }
}
