using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Instructions
{
    public class InstructionDto
    {
        public int Id { get; set; }
        public int Step { get; set; }
        public required string Text { get; set; }
        public int RecipeId { get; set; }
    }
}