using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.Category;
using API.Repositories.Interfaces;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class SQLRecipeRepository : IRecipeRepository
    {
        private readonly BlogContext context;

        public SQLRecipeRepository(BlogContext context)
        {
            this.context = context;
        }

        public async Task<List<RecipeDto>> GetAllAsync(string? search, List<string?> categories, int? page, int pageSize = 50, bool isAscending = true, string? sortBy = null)
        {
            var query = context.Recipes.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(recipe => recipe.Name.Contains(search));
            }

            if (categories != null && categories.Count != 0)
            {
                query = query.Where(recipe =>
                    recipe.Categories.Any(category => categories.Contains(category.Name)));
            }

            if (string.IsNullOrWhiteSpace(sortBy) == false)
            {
                if (sortBy.Equals("name", StringComparison.OrdinalIgnoreCase))
                {
                    query = isAscending ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name);
                }
                else if (sortBy.Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    query = isAscending ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id);
                }
                else if (sortBy.Equals("createdAt", StringComparison.OrdinalIgnoreCase))
                {
                    query = isAscending ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt);
                }
            }


            if (page == null || page < 1) page = 1;

            int totalPages = 0;

            decimal count = query.Count();
            totalPages = (int)Math.Ceiling(count / pageSize);

            query = query.Skip((int)(page - 1) * pageSize).Take(pageSize);

            var recipes = await query.Select(recipe => new RecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                CookingTime = recipe.CookingTime,
                Difficulty = recipe.Difficulty,
                ServingSize = recipe.ServingSize,
                CreatedAt = recipe.CreatedAt,
                ImageUrl = recipe.ImageUrl,
                AverageRating = recipe.Ratings.Any() ? recipe.Ratings.Average(r => r.Value) : 0,
                Categories = recipe.Categories.Select(c => new CategoryDto
                {
                    Name = c.Name,
                    Slug = c.Slug
                }).ToList()
            }).ToListAsync();

            return recipes;

        }

        public Task<Recipe> CreateAsync(Recipe recipe)
        {
            throw new NotImplementedException();
        }

        public Task<Recipe?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }



        public Task<Recipe?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Recipe?> UpdateAsync(int id, Recipe recipe)
        {
            throw new NotImplementedException();
        }
    }
}