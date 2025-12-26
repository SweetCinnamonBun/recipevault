using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.AI
{
    public class RecipeAiImageRequestDto
    {
        public string Prompt { get; set; } = string.Empty;
    }
}