using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Ingredients;
using Core.Entities;

namespace API.DTOs
{
    public class CreateRecipeDto
    {

        [Required]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters long")]
        [MaxLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MinLength(2, ErrorMessage = "Description must be at least 2 characters long")]
        [MaxLength(2000, ErrorMessage = "Description cannot be longer than 2000 characters")]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string CookingTime { get; set; } = string.Empty;

        [Required]
        public string Difficulty { get; set; } = string.Empty;
        [Required]
        public int ServingSize { get; set; }
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        // public ICollection<Category> Categories { get; set; } = [];
        // public List<IngredientDto> Ingredients { get; set; }
        // public List<InstructionDto> Instructions { get; set; }
    }
}