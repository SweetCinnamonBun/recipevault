using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Ingredients
{
    public class UpdateIngredientDto
    {
        public required string Name { get; set; }
        public required string Quantity { get; set; }
        public required string Unit { get; set; }
    }
}