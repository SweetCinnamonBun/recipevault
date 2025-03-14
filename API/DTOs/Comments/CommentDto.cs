using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Comments
{
    public class CommentDto
    {
        public required string Content { get; set; }
        public int RecipeId { get; set; }
    }
}