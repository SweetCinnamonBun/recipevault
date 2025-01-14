using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Category
{
    public class AddCategoriesToRecipeDto
    {
        public int RecipeId { get; set; }
        public List<int> CategoryIds { get; set; } = [];
    }
}