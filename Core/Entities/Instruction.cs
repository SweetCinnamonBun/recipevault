using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Instruction
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public int RecipeId { get; set; }
        public Recipe? Recipe { get; set; }
    }
}