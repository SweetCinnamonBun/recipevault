using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Ratings
{
    public class AddRatingDto
    {
        public int Value { get; set; }
        public int RecipeId { get; set; }
    }
}