using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.Category;
using API.DTOs.Ingredients;
using API.DTOs.Instructions;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly BlogContext context;
        private readonly IWebHostEnvironment env;
        private readonly IMapper mapper;
        private readonly SignInManager<AppUser> signInManager;

        public RecipesController(BlogContext context, IWebHostEnvironment env, IMapper mapper, SignInManager<AppUser> signInManager)
        {
            this.context = context;
            this.env = env;
            this.mapper = mapper;
            this.signInManager = signInManager;
        }


        [HttpGet]
        public async Task<IActionResult> GetRecipes([FromQuery] string? search, [FromQuery] List<string>? categories,
        [FromQuery] int? page, [FromQuery] int pageSize = 50, [FromQuery] bool isAscending = true, [FromQuery] string? sortBy = null)
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
            }


            if (page == null || page < 1) page = 1;

            int totalPages = 0;

            decimal count = query.Count();
            totalPages = (int)Math.Ceiling(count / pageSize);

            query = query.Skip((int)(page - 1) * pageSize).Take(pageSize);


            var recipes = await query.Select(recipe => new
            {
                recipe.Id,
                recipe.Name,
                recipe.Description,
                recipe.CookingTime,
                recipe.Difficulty,
                recipe.ServingSize,
                recipe.CreatedAt,
                recipe.ImageUrl,
                AverageRating = recipe.Ratings.Any() ? recipe.Ratings.Average(r => r.Value) : 0 // Calculate the average rating
            })
        .ToListAsync();

            var response = new
            {
                Recipes = recipes,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRecipe([FromRoute] int id)
        {
            var recipe = await context.Recipes.Include(x => x.Categories).Include(x => x.Ingredients).Include(x => x.Instructions).FirstOrDefaultAsync((x) => x.Id == id);

            if (recipe == null) return NotFound();

            var dto = mapper.Map<RecipeDto>(recipe);

            return Ok(dto);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromBody] CreateRecipeDto recipeDto)
        {

            // if (recipeDto.ImageFile == null)
            // {
            //     ModelState.AddModelError("ImageFile", "Please select an image");
            //     return BadRequest(ModelState);
            // }

            // Save the image file
            // string imageFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + Path.GetExtension(recipeDto.ImageFile.FileName);
            // string imagesFolder = Path.Combine(env.WebRootPath, "images", "recipes");

            // if (!Directory.Exists(imagesFolder))
            // {
            //     Directory.CreateDirectory(imagesFolder);
            // }

            // string imagePath = Path.Combine(imagesFolder, imageFileName);
            // using (var stream = new FileStream(imagePath, FileMode.Create))
            // {
            //     await recipeDto.ImageFile.CopyToAsync(stream);
            // }

            // Create the Recipe entity

            var user = await signInManager.UserManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return NotFound();


            Recipe recipe = new()
            {
                Name = recipeDto.Name,
                Description = recipeDto.Description,
                CookingTime = recipeDto.CookingTime,
                Difficulty = recipeDto.Difficulty,
                ServingSize = recipeDto.ServingSize,
                ImageUrl = recipeDto.ImageUrl,
                CreatedAt = DateTime.Now,
                UserId = user.Id
            };

            Console.WriteLine(recipe);
            Console.WriteLine(recipeDto);

            // Save the recipe to generate RecipeId
            await context.Recipes.AddAsync(recipe);
            await context.SaveChangesAsync();

            var resultDto = mapper.Map<RecipeDto>(recipe);

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, resultDto);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] UpdateRecipeDto updatedRecipeDto)
        {
            if (updatedRecipeDto == null)
            {
                return BadRequest("Invalid data.");
            }

            // Fetch the existing recipe from the database
            var existingRecipe = await context.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Categories)
                .Include(r => r.Instructions)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (existingRecipe == null)
            {
                return NotFound("Recipe not found.");
            }

            // Update scalar properties
            existingRecipe.Name = updatedRecipeDto.Name;
            existingRecipe.Description = updatedRecipeDto.Description;
            existingRecipe.CookingTime = updatedRecipeDto.CookingTime;
            existingRecipe.Difficulty = updatedRecipeDto.Difficulty;
            existingRecipe.ImageUrl = updatedRecipeDto.ImageUrl;

            // Update navigation properties
            UpdateIngredients(existingRecipe, updatedRecipeDto.Ingredients);
            UpdateCategories(existingRecipe, updatedRecipeDto.Categories);
            UpdateInstructions(existingRecipe, updatedRecipeDto.Instructions);

            // Save changes to the database
            await context.SaveChangesAsync();

            return NoContent(); // 204 No Content
        }



        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var recipe = await context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            // string imagesFolder = env.WebRootPath + "/images/recipes/";
            // System.IO.File.Delete(imagesFolder + recipe.ImageFileName);

            context.Recipes.Remove(recipe);
            await context.SaveChangesAsync();

            return Ok();

        }

        [Authorize]
        [HttpGet("my-recipes")]
        public async Task<IActionResult> GetUserRecipes()
        {

            var user = await signInManager.UserManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return NotFound();

            var recipes = await context.Recipes
                .Where(r => r.UserId == user.Id)
                .ToListAsync();


            return Ok(mapper.Map<List<RecipeDto>>(recipes));
        }

        private void UpdateIngredients(Recipe existingRecipe, ICollection<IngredientDto> updatedIngredients)
        {
            // Remove ingredients not in the updated list
            var ingredientsToRemove = existingRecipe.Ingredients
                .Where(existing => !updatedIngredients.Any(updated => updated.Id == existing.Id))
                .ToList();

            foreach (var ingredient in ingredientsToRemove)
            {
                existingRecipe.Ingredients.Remove(ingredient);
            }

            // Add or update ingredients
            foreach (var updatedIngredient in updatedIngredients)
            {
                var existingIngredient = existingRecipe.Ingredients
                    .FirstOrDefault(i => i.Id == updatedIngredient.Id);

                if (existingIngredient == null)
                {
                    // Add new ingredient
                    existingRecipe.Ingredients.Add(new Ingredient
                    {
                        Name = updatedIngredient.Name,
                        Quantity = updatedIngredient.Quantity,
                        Unit = updatedIngredient.Unit
                    });
                }
                else
                {
                    // Update existing ingredient
                    existingIngredient.Name = updatedIngredient.Name;
                    existingIngredient.Quantity = updatedIngredient.Quantity;
                    existingIngredient.Unit = updatedIngredient.Unit;
                }
            }
        }

        private void UpdateInstructions(Recipe existingRecipe, ICollection<InstructionDto> updatedInstructions)
        {
            // Remove instructions not in the updated list
            var instructionsToRemove = existingRecipe.Instructions
                .Where(existing => !updatedInstructions.Any(updated => updated.Id == existing.Id))
                .ToList();

            foreach (var instruction in instructionsToRemove)
            {
                existingRecipe.Instructions.Remove(instruction);
            }

            // Add or update instructions
            foreach (var updatedInstruction in updatedInstructions)
            {
                var existingInstruction = existingRecipe.Instructions
                    .FirstOrDefault(i => i.Id == updatedInstruction.Id);

                if (existingInstruction == null)
                {
                    // Add new instruction
                    existingRecipe.Instructions.Add(new Instruction
                    {
                        Text = updatedInstruction.Text,
                        RecipeId = updatedInstruction.RecipeId
                    });
                }
                else
                {
                    // Update existing instruction
                    existingInstruction.Text = updatedInstruction.Text;
                    existingInstruction.RecipeId = updatedInstruction.RecipeId;
                }
            }
        }
        private void UpdateCategories(Recipe existingRecipe, ICollection<CategoryDto> updatedCategories)
        {
            // Remove categories not in the updated list
            var categoriesToRemove = existingRecipe.Categories
                .Where(existing => !updatedCategories.Any(updated => updated.Id == existing.Id))
                .ToList();

            foreach (var category in categoriesToRemove)
            {
                existingRecipe.Categories.Remove(category);
            }

            // Add or update categories
            foreach (var updatedCategory in updatedCategories)
            {
                var existingCategory = existingRecipe.Categories
                    .FirstOrDefault(c => c.Id == updatedCategory.Id);

                if (existingCategory == null)
                {
                    // Add new category
                    existingRecipe.Categories.Add(new Category
                    {
                        Name = updatedCategory.Name,
                        Slug = updatedCategory.Slug
                    });
                }
                else
                {
                    // Update existing category
                    existingCategory.Name = updatedCategory.Name;
                    existingCategory.Slug = updatedCategory.Slug;
                }
            }
        }
    }
}