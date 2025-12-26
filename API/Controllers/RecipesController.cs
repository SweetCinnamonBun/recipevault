using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.AI;
using API.DTOs.Category;
using API.DTOs.Ingredients;
using API.DTOs.Instructions;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OpenAI.Chat;
using OpenAI.Images;

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
        private readonly string? openAIApiKey;

        public RecipesController(BlogContext context, IWebHostEnvironment env,
         IMapper mapper, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            this.context = context;
            this.env = env;
            this.mapper = mapper;
            this.signInManager = signInManager;
            this.openAIApiKey = configuration["ConnectionStrings:OpenAIApiKey"];
        }


        [HttpGet]
        public async Task<IActionResult> GetRecipes([FromQuery] string? search, [FromQuery] List<string>? categories,
        [FromQuery] int? page, [FromQuery] int pageSize = 50, [FromQuery] bool isAscending = true, [FromQuery] string? sortBy = null)
        {

            var query = context.Recipes.AsQueryable();

            // Check if string is not empty
            if (!string.IsNullOrEmpty(search))
            {
                // Find all the recipes that match the search query
                query = query.Where(recipe => recipe.Name.Contains(search));
            }

            // Check that there are categories
            if (categories != null && categories.Count != 0)
            {
                // Get recipes that match a category name from the incoming categories list.
                query = query.Where(recipe =>
                    recipe.Categories.Any(category => categories.Contains(category.Name)));
            }
            // Check if sortBy is not empty
            if (string.IsNullOrWhiteSpace(sortBy) == false)
            {
                // Check for which column should the sorting be applied
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

            // Set the page to 1 if page is null or page is less than 1
            if (page == null || page < 1) page = 1;

            int totalPages = 0;

            // Counting the total pages of the query result
            decimal count = query.Count();
            totalPages = (int)Math.Ceiling(count / pageSize);

            // Applying pagination
            query = query.Skip((int)(page - 1) * pageSize).Take(pageSize);

            // Map the recipe objects to Dto's and add an average rating to each recipe.
            var recipeDtos = await query.Select(recipe => new RecipeDto
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
                Categories = recipe.Categories.Select(c => new CategoryDto { Name = c.Name, Slug = c.Slug }).ToList()
            })
        .ToListAsync();

            var response = new
            {
                Recipes = recipeDtos,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRecipe([FromRoute] int id)
        {
            // Get the specific recipe that corresponds to the Id from the request.
            var recipe = await context.Recipes.Include(x => x.Categories)
            .Include(x => x.Ingredients)
            .Include(x => x.Instructions)
            .Include(x => x.Ratings)
            .Include(x => x.User)
            .FirstOrDefaultAsync((x) => x.Id == id);

            if (recipe == null) return NotFound();

            // Map domain model to dto
            var dto = mapper.Map<RecipeDto>(recipe);

            // Add Average Rating and Rating Count to the Dto
            dto.AverageRating = recipe.Ratings.Count != 0 ? Math.Round(recipe.Ratings.Average(r => r.Value), 2) : 0;
            dto.RatingCount = recipe.Ratings.Count;

            return Ok(dto);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromBody] CreateRecipeDto recipeDto)
        {


            // Access the currently logged in user.
            var user = await signInManager.UserManager.Users.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return NotFound();

            if (ModelState.IsValid)
            {
                // Create new recipe
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

                // Save the recipe to generate RecipeId
                await context.Recipes.AddAsync(recipe);
                await context.SaveChangesAsync();

                var resultDto = mapper.Map<RecipeDto>(recipe);

                return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, resultDto);
            }

            return BadRequest();

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
            existingRecipe.ServingSize = updatedRecipeDto.ServingSize;
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
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

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
                .Include(c => c.Categories)
                .Include(x => x.Ratings)
                .ToListAsync();

            var result = recipes.Select(recipe => new RecipeDto
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
                RatingCount = recipe.Ratings.Count(),
                Categories = [.. recipe.Categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug
                })]

            });

            return Ok(result);
        }


        [HttpPost("generate-ai-text")]
        public async Task<IActionResult> GenerateRecipeWithImage([FromBody] RecipeAiImageRequestDto requestDto)
        {
            var chatClient = new ChatClient("gpt-4.1-mini", openAIApiKey);

            var chatResult = await chatClient.CompleteChatAsync(new ChatMessage[]
            {
        new UserChatMessage($"Create a detailed cooking recipe for: {requestDto.Prompt}")
            });

            var recipeText = chatResult?.Value?.Content?.FirstOrDefault()?.Text ?? "No recipe generated.";

            // var imageClient = new ImageClient("gpt-image-1", openAIApiKey);

            // var imageResult = await imageClient.GenerateImageAsync(
            //     $"A high-quality food photograph of {requestDto.Prompt}",
            //     new ImageGenerationOptions
            //     {
            //         Size = OpenAI.Images.GeneratedImageSize.W1024xH1024  // Fully qualified
            //     });

            // var imageUrl = imageResult?.Value?.ImageUri?.ToString() ?? string.Empty;

            return Ok(new
            {
                Recipe = recipeText
            });
        }





        private void UpdateIngredients(Recipe existingRecipe, ICollection<IngredientDto> updatedIngredients)
        {
            // Find existing ingredient IDs
            var existingIngredientIds = existingRecipe.Ingredients.Select(i => i.Id).ToList();

            // Find ingredients to remove
            var ingredientsToRemove = existingRecipe.Ingredients
                .Where(i => !updatedIngredients.Any(ui => ui.Id == i.Id))
                .ToList();

            // Remove ingredients that are not in the updated list / Remove old ingredients
            context.Ingredients.RemoveRange(ingredientsToRemove);

            // Find new ingredients to add
            var newIngredients = updatedIngredients
                .Where(ui => !existingIngredientIds.Contains(ui.Id))
                .Select(ui => new Ingredient
                {
                    Name = ui.Name,
                    Quantity = ui.Quantity,
                    Unit = ui.Unit,
                    RecipeId = existingRecipe.Id
                })
                .ToList();

            // Add all new ingredients in bulk
            if (newIngredients.Any())
            {
                context.Ingredients.AddRange(newIngredients);
            }
        }


        private void UpdateInstructions(Recipe existingRecipe, ICollection<InstructionDto> updatedInstructions)
        {
            var existingInstructionIds = existingRecipe.Instructions.Select(i => i.Id).ToList();

            var instructionsToRemove = existingRecipe.Instructions
                .Where(i => !updatedInstructions.Any(ui => ui.Id == i.Id))
                .ToList();

            context.Instructions.RemoveRange(instructionsToRemove);

            var newInstructions = updatedInstructions
                .Where(ui => !existingInstructionIds.Contains(ui.Id))
                .Select(ui => new Instruction
                {
                    Text = ui.Text,
                    RecipeId = existingRecipe.Id
                })
                .ToList();

            if (newInstructions.Any())
            {
                context.Instructions.AddRange(newInstructions);
            }
        }
        private void UpdateCategories(Recipe existingRecipe, ICollection<CategoryDto> updatedCategories)
        {
            var updatedCategoryIds = updatedCategories.Select(c => c.Id).ToList();

            // Remove categories that are not in the updated list
            existingRecipe.Categories = existingRecipe.Categories
                .Where(c => updatedCategoryIds.Contains(c.Id))
                .ToList();

            foreach (var updatedCategory in updatedCategories)
            {
                var existingCategory = context.Categories
                    .FirstOrDefault(c => c.Id == updatedCategory.Id);

                if (existingCategory == null)
                {
                    existingCategory = new Category
                    {
                        Name = updatedCategory.Name,
                        Slug = updatedCategory.Slug
                    };
                    context.Categories.Add(existingCategory);
                }

                if (!existingRecipe.Categories.Any(c => c.Id == existingCategory.Id))
                {
                    existingRecipe.Categories.Add(existingCategory);
                }
            }
        }

    }


}