using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Category;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly BlogContext context;

        public CategoriesController(BlogContext context)
        {
            this.context = context;
        }



        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await context.Categories.ToListAsync();

            return Ok(categories);
        }

        [HttpGet("recipes-categories/{recipeId}")]
        public async Task<IActionResult> GetCategoriesForRecipe([FromRoute] int recipeId)
        {
            var recipe = await context.Recipes
                .Include(r => r.Categories)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                return NotFound("Recipe not found");
            }

            var categories = recipe.Categories
                .Select(c => new CategoryDto // Use a DTO to return only necessary data
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug
                })
                .ToList();

            return Ok(categories);
        }


        [HttpPost("bulk")]
        public async Task<IActionResult> AddMultipleCategories([FromBody] List<CreateCategoryDto> categoryDtos)
        {
            if (categoryDtos == null || categoryDtos.Count == 0)
            {
                return BadRequest("No categories provided");
            }

            var categories = categoryDtos.Select(dto => new Category
            {
                Name = dto.Name,
                Slug = dto.Slug
            }).ToList();

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();

            return Ok("Categories added successfully");
        }

        [HttpPost("add-to-recipe")]
        public async Task<IActionResult> AddCategoriesToRecipe([FromBody] AddCategoriesToRecipeDto dto)
        {
            if (dto.CategoryIds == null || dto.CategoryIds.Count == 0)
            {
                return BadRequest("No category IDs provided");
            }

            var recipe = await context.Recipes.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == dto.RecipeId);

            if (recipe == null)
            {
                return NotFound("Recipe not found");
            }

            var categories = await context.Categories.Where(c => dto.CategoryIds.Contains(c.Id)).ToListAsync();

            foreach (var category in categories)
            {
                if (!recipe.Categories.Any(c => c.Id == category.Id))
                {
                    recipe.Categories.Add(category);
                }
            }

            await context.SaveChangesAsync();

            return Ok("Categories added to recipe successfully.");

        }
    }
}