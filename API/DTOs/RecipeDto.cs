using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Category;
using API.DTOs.Ingredients;
using API.DTOs.Instructions;
using API.DTOs.Ratings;

namespace API.DTOs
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string CookingTime { get; set; }
        public required string Difficulty { get; set; }
        public int ServingSize { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public required string ImageUrl { get; set; }
        public double? AverageRating { get; set; }
        public int? RatingCount { get; set; }
        public ICollection<RatingDto> Ratings { get; set; } = [];
        public ICollection<CategoryDto> Categories { get; set; } = [];
        public ICollection<InstructionDto> Instructions { get; set; } = [];
        public ICollection<IngredientDto> Ingredients { get; set; } = [];
        public string? UserId { get; set; }
    }
}