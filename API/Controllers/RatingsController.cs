using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.Ratings;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly BlogContext context;

        public RatingsController(BlogContext context)
        {
            this.context = context;
        }

        // GET: api/ratings/recipe/{recipeId}
        [HttpGet("recipe/{recipeId}")]
        public async Task<IActionResult> GetRatingsForRecipe(int recipeId)
        {
            var ratings = await context.Ratings
                .Where(r => r.RecipeId == recipeId)
                .ToListAsync();

            return Ok(ratings);
        }

        // POST: api/ratings
        [Authorize] // Requires authentication
        [HttpPost]
        public async Task<IActionResult> AddRating([FromBody] AddRatingDto ratingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            // Check if the user has already rated this recipe
            var existingRating = await context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.RecipeId == ratingDto.RecipeId);

            if (existingRating != null)
                return BadRequest("User has already rated this recipe.");

            var rating = new Rating
            {
                UserId = userId,
                RecipeId = ratingDto.RecipeId,
                Value = ratingDto.Value,
            };

            // Add the rating and save changes
            context.Ratings.Add(rating);
            await context.SaveChangesAsync();

            // Return the created rating object with a CreatedAtAction response
            return CreatedAtAction(nameof(GetRatingsForRecipe), new { recipeId = rating.RecipeId }, rating);
        }

        [HttpGet("recipe/{recipeId}/average")]
        public async Task<IActionResult> GetAverageRatingForRecipe(int recipeId)
        {
            var ratings = await context.Ratings
                .Where(r => r.RecipeId == recipeId)
                .ToListAsync();

            if (ratings.Count == 0)
            {
                return Ok(new { Rating = 0 }); // No ratings available
            }

            var averageRating = ratings.Average(r => r.Value); // Calculate average rating
            var roundedRating = Math.Round(averageRating, 1); // Round to 1 decimal place

            return Ok(new { Rating = roundedRating });
        }

        // PUT: api/ratings/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, [FromBody] Rating updatedRating)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var rating = await context.Ratings.FindAsync(id);
            if (rating == null || rating.UserId != userId)
                return NotFound("Rating not found or user unauthorized.");

            rating.Value = updatedRating.Value;
            await context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ratings/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var rating = await context.Ratings.FindAsync(id);
            if (rating == null || rating.UserId != userId)
                return NotFound("Rating not found or user unauthorized.");

            context.Ratings.Remove(rating);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}