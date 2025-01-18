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

        // public required DbSet<Image> Images { get; set; }


    }
}