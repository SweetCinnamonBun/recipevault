using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreateRecipeDto
    {
        public required string Name { get; set; }
        public required string CookingTime { get; set; }
        public IFormFile? ImageFile { get; set; }

        // public ICollection<Category> Categories { get; set; } = [];
    }
}