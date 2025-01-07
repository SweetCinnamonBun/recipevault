using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Ingredient
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Quantity { get; set; }
        public required string Unit { get; set; }

        public int RecipeId { get; set; }
        public required Recipe Recipe { get; set; }
    }
}