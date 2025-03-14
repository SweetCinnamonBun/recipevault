using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.Comments;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly BlogContext context;

        public CommentsController(BlogContext context)
        {
            this.context = context;
        }

        [HttpGet("{recipeId}/comments")]
        public async Task<IActionResult> GetComments(int recipeId)
        {
            var comments = await context.Comments
                .Where(c => c.RecipeId == recipeId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt
            }));
        }

        [HttpPost("{recipeId}/comments")]
        public async Task<IActionResult> AddComment(int recipeId, [FromBody] CommentDto commentDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var recipe = await context.Recipes.FindAsync(recipeId);
            if (recipe == null) return NotFound();

            var comment = new Comment
            {
                UserId = userId,
                RecipeId = recipeId,
                Content = commentDto.Content
            };

            context.Comments.Add(comment);
            await context.SaveChangesAsync();

            return Ok(new { message = "Comment added successfully" });
        }
    }
}