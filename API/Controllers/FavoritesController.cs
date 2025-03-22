using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.Category;
using API.DTOs.Ratings;
using AutoMapper;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly BlogContext context;
        private readonly IMapper mapper;

        public FavoritesController(BlogContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }


        [HttpPost("{recipeId}")]
        public async Task<IActionResult> AddFavorite(int recipeId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await context.Users.Include(u => u.FavoriteRecipes)
                                           .FirstOrDefaultAsync(u => u.Id == userId);
            var recipe = await context.Recipes.FindAsync(recipeId);

            if (user == null || recipe == null) return NotFound();

            if (!user.FavoriteRecipes.Contains(recipe))
            {
                user.FavoriteRecipes.Add(recipe);
                await context.SaveChangesAsync();
                return Ok(new { message = "Recipe added to favorites" });
            }

            return BadRequest(new { message = "Recipe is already in favorites" });
        }

        [HttpGet("my-favorites")]
        public async Task<IActionResult> GetUserFavorites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await context.Users
                .Include(u => u.FavoriteRecipes)
                    .ThenInclude(r => r.Ratings)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();


            var result = user.FavoriteRecipes.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                CookingTime = recipe.CookingTime,
                Difficulty = recipe.Difficulty,
                ServingSize = recipe.ServingSize,
                CreatedAt = recipe.CreatedAt,
                ImageUrl = recipe.ImageUrl,
                AverageRating = recipe.Ratings.Any() ? recipe.Ratings.Average(r => r.Value) : 0,
                RatingCount = recipe.Ratings.Count(),
                Categories = recipe.Categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpDelete("{recipeId}")]
        public async Task<IActionResult> RemoveFavorite(int recipeId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await context.Users.Include(u => u.FavoriteRecipes)
                                           .FirstOrDefaultAsync(u => u.Id == userId);
            var recipe = await context.Recipes.FindAsync(recipeId);

            if (user == null || recipe == null) return NotFound();

            if (user.FavoriteRecipes.Contains(recipe))
            {
                user.FavoriteRecipes.Remove(recipe);
                await context.SaveChangesAsync();
                return Ok(new { message = "Recipe removed from favorites" });
            }

            return BadRequest(new { message = "Recipe is not in favorites" });
        }

    }
}