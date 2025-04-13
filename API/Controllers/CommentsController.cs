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
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                UserId = c.User.Id,
                User = new { c.User.Id, c.User.UserName }
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
                Content = commentDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            context.Comments.Add(comment);
            await context.SaveChangesAsync();


            var savedComment = await context.Comments
                .Where(c => c.Id == comment.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.RecipeId,
                    c.UserId,
                    c.CreatedAt,
                    User = new
                    {
                        c.User.Id,
                        c.User.UserName
                    }
                })
                .FirstOrDefaultAsync();

            return Ok(savedComment);
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comment = await context.Comments.FindAsync(commentId);
            if (comment == null) return NotFound();

            if (comment.UserId != userId) return Forbid(); // Prevent deletion by other users

            context.Comments.Remove(comment);
            await context.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully" });
        }
    }
}