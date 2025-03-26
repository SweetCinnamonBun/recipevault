using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Ratings
{
    public class RecipeRatingDto
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public string? UserId { get; set; }
        public int RecipeId { get; set; }
    }
}