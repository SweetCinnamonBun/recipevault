using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class BlogContext : IdentityDbContext<AppUser>
    {
        public BlogContext(DbContextOptions<BlogContext> options) : base(options)
        {

        }

        public required DbSet<Category> Categories { get; set; }

        public required DbSet<Recipe> Recipes { get; set; }

        public required DbSet<Instruction> Instructions { get; set; }

        public required DbSet<Ingredient> Ingredients { get; set; }

        public required DbSet<Comment> Comments { get; set; }

        public required DbSet<Rating> Ratings { get; set; }

        // public required DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Ensure Identity configuration

            // Configure the one-to-many relationship between AppUser and Recipe
            modelBuilder.Entity<Recipe>()
                .HasOne<AppUser>(r => r.User)
                .WithMany(u => u.Recipes)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction); // Prevent cascade delete

            // Many-to-Many: Users <-> FavoriteRecipes <-> Recipes
            modelBuilder.Entity<AppUser>()
                .HasMany(u => u.FavoriteRecipes)
                .WithMany(r => r.FavoritedBy)
                .UsingEntity(j => j.ToTable("UserFavorites"));


            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Recipe)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Recipe)
                .WithMany(r => r.Ratings)
                .HasForeignKey(r => r.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);
        }



    }
}