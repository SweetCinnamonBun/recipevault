using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Ingredients;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly BlogContext context;

        public IngredientsController(BlogContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetIngredients()
        {
            var ingredients = await context.Ingredients.ToListAsync();

            return Ok(ingredients);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> CreateIngredientsForRecipe(int recipeId, List<CreateIngredientDto> ingredientDtos)
        {
            // Check if the recipe exists
            var recipe = await context.Recipes.FindAsync(recipeId);
            if (recipe == null)
            {
                return NotFound($"Recipe with ID {recipeId} not found.");
            }

            // Map DTOs to Ingredient entities
            var ingredients = ingredientDtos.Select(dto => new Ingredient
            {
                Name = dto.Name,
                Quantity = dto.Quantity,
                Unit = dto.Unit,
                RecipeId = recipeId
            }).ToList();

            // Add ingredients to the database
            await context.Ingredients.AddRangeAsync(ingredients);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> BulkDeleteIngredients([FromBody] List<int> ingredientIds)
        {
            if (ingredientIds == null || ingredientIds.Count == 0)
            {
                return BadRequest("No ingredient IDs provided");
            }

            try
            {
                var ingredientsToDelete = context.Ingredients.Where(i => ingredientIds.Contains(i.Id)).ToList();

                if (!ingredientsToDelete.Any())
                {
                    return NotFound("No ingredients found for the provided IDs");
                }

                context.Ingredients.RemoveRange(ingredientsToDelete);
                await context.SaveChangesAsync();

                return Ok("Ingredients successfully deleted");

            }
            catch (System.Exception)
            {
                return StatusCode(500, "Something went wrong");
            }
        }
    }
}