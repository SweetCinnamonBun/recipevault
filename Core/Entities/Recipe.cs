using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RecipesAPI.Models.Domain
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CookingTime { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<Direction> Directions { get; set; }
        public List<Category> Categories { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }
        public ShoppingList ShoppingList { get; set; }
        public List<Image> Images { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserProfileId { get; set; }

        //Navigation
        public UserProfile UserProfile { get; set; }


    }
}