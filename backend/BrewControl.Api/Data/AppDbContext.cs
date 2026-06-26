using BrewControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BrewControl.Api.Data;

// Contexto do Entity Framework Core — único ponto de mapeamento das
// entidades para o PostgreSQL. O acesso a este contexto é restrito à
// camada de Repositories.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Cerveja> Cervejas => Set<Cerveja>();
    public DbSet<Tanque> Tanques => Set<Tanque>();
    public DbSet<ParametrosFermentativos> ParametrosFermentativos => Set<ParametrosFermentativos>();
    public DbSet<RegistroFermentativo> RegistrosFermentativos => Set<RegistroFermentativo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cada cerveja possui um único conjunto de parâmetros fermentativos.
        modelBuilder.Entity<ParametrosFermentativos>()
            .HasOne(p => p.Cerveja)
            .WithMany()
            .HasForeignKey(p => p.CervejaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Um registro referencia uma cerveja e um tanque. Impede exclusão
        // em cascata para preservar o histórico fermentativo.
        modelBuilder.Entity<RegistroFermentativo>()
            .HasOne(r => r.Cerveja)
            .WithMany()
            .HasForeignKey(r => r.CervejaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RegistroFermentativo>()
            .HasOne(r => r.Tanque)
            .WithMany()
            .HasForeignKey(r => r.TanqueId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
