using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace API.DTOs.Ratings
{
    public class RatingDto
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public string? UserId { get; set; }
        public int RecipeId { get; set; }
        public AppUser? User { get; set; }
        public Recipe? Recipe { get; set; }
    }
}