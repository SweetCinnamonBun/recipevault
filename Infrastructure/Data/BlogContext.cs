using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class BlogContext : DbContext
    {
        public BlogContext(DbContextOptions options) : base(options)
        {

        }

        public required DbSet<Category> Categories { get; set; }

        public required DbSet<Recipe> Recipes { get; set; }

        public required DbSet<Image> Images { get; set; }


    }
}