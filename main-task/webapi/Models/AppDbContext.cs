using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using webapi.Models.DbModels;

namespace webapi.Models
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public DbSet<Funfic> Funfics { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Rating> Ratings { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Rating>().HasKey(r => new { r.FunficId, r.UserId });

            modelBuilder
                .Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId);

            modelBuilder
               .Entity<Comment>()
               .HasOne(c => c.Funfic)
               .WithMany(f => f.Comments)
               .HasForeignKey(c => c.FunficId);

            modelBuilder
               .Entity<Rating>()
               .HasOne(r => r.Funfic)
               .WithMany(r => r.Ratings)
               .HasForeignKey(r => r.FunficId);

            modelBuilder
               .Entity<Rating>()
               .HasOne(r => r.User)
               .WithMany(u => u.Ratings)
               .HasForeignKey(r => r.UserId);
        }
    }
}