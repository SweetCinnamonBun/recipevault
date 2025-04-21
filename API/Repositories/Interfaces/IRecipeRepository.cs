using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Core.Entities;

namespace API.Repositories.Interfaces
{
    public interface IRecipeRepository
    {
        Task<List<RecipeDto>> GetAllAsync(string? search, List<string?> categories, int? page, int pageSize = 50, bool isAscending = true, string? sortBy = null);

        Task<Recipe?> GetByIdAsync(int id);

        Task<Recipe> CreateAsync(Recipe recipe);

        Task<Recipe?> UpdateAsync(int id, Recipe recipe);

        Task<Recipe?> DeleteAsync(int id);
    }
}