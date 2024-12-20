using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
    }
}