using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Rating
    {
        public int Id { get; set; }

        [Range(1, 5)]
        public int Value { get; set; }

        public string? UserId { get; set; }
        public int RecipeId { get; set; }

        public AppUser? User { get; set; }
        public Recipe? Recipe { get; set; }

    }
}