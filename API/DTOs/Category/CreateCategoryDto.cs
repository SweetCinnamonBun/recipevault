using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Category
{
    public class CreateCategoryDto
    {
        public required string Name { get; set; }
        public required string Slug { get; set; }
    }
}