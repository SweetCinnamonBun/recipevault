using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class AppUser : IdentityUser
    {

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileName { get; set; }
        public ICollection<Recipe> Recipes { get; set; } = [];
        public ICollection<Recipe> FavoriteRecipes { get; set; } = [];
        public ICollection<Comment> Comments { get; set; } = [];
        public ICollection<Rating> Ratings { get; set; } = [];
    }
}