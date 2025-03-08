using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string CookingTime { get; set; }
        public required string Difficulty { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public required string ImageUrl { get; set; }

        // public ICollection<Image> Images { get; set; } = [];
        public ICollection<Category> Categories { get; set; } = [];
        public ICollection<Instruction> Instructions { get; set; } = [];
        public ICollection<Ingredient> Ingredients { get; set; } = [];
    }
}