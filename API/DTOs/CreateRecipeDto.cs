using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Ingredients;
using Core.Entities;

namespace API.DTOs
{
    public class CreateRecipeDto
    {
        public required string Name { get; set; }
        public required string CookingTime { get; set; }
        public required string Difficulty { get; set; }
        public required string Description { get; set; }
        public IFormFile? ImageFile { get; set; }

        // public ICollection<Category> Categories { get; set; } = [];
        // public List<IngredientDto> Ingredients { get; set; }
        // public List<InstructionDto> Instructions { get; set; }
    }
}