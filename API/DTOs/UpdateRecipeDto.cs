using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Category;
using API.DTOs.Ingredients;
using API.DTOs.Instructions;

namespace API.DTOs
{
    public class UpdateRecipeDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string CookingTime { get; set; }
        public required string Difficulty { get; set; }
        public IFormFile? ImageFile { get; set; }
        public ICollection<CategoryDto> Categories { get; set; } = [];
        public ICollection<InstructionDto> Instructions { get; set; } = [];
        public ICollection<IngredientDto> Ingredients { get; set; } = [];
    }
}