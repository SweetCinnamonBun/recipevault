using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.DTOs;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
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

        public RecipesController(BlogContext context, IWebHostEnvironment env, IMapper mapper)
        {
            this.context = context;
            this.env = env;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetRecipes([FromQuery] string? search, [FromQuery] List<string>? categories,
        [FromQuery] int? page, [FromQuery] int pageSize = 5, [FromQuery] bool isAscending = true, [FromQuery] string? sortBy = null)
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


            var recipes = await query.ToListAsync();

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
            var recipe = await context.Recipes.Include(x => x.Ingredients).Include(x => x.Instructions).FirstOrDefaultAsync((x) => x.Id == id);

            if (recipe == null) return NotFound();

            var dto = mapper.Map<RecipeDto>(recipe);

            return Ok(dto);
        }



        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromForm] CreateRecipeDto recipeDto)
        {

            if (recipeDto.ImageFile == null)
            {
                ModelState.AddModelError("ImageFile", "Please select an image");
                return BadRequest(ModelState);
            }

            // Save the image file
            string imageFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + Path.GetExtension(recipeDto.ImageFile.FileName);
            string imagesFolder = Path.Combine(env.WebRootPath, "images", "recipes");

            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            string imagePath = Path.Combine(imagesFolder, imageFileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await recipeDto.ImageFile.CopyToAsync(stream);
            }

            // Create the Recipe entity
            Recipe recipe = new()
            {
                Name = recipeDto.Name,
                Description = recipeDto.Description,
                CookingTime = recipeDto.CookingTime,
                ImageFileName = imageFileName,
                CreatedAt = DateTime.Now
            };

            Console.WriteLine(recipe);
            Console.WriteLine(recipeDto);

            // Save the recipe to generate RecipeId
            await context.Recipes.AddAsync(recipe);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var recipe = await context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            string imagesFolder = env.WebRootPath + "/images/recipes/";
            System.IO.File.Delete(imagesFolder + recipe.ImageFileName);

            context.Recipes.Remove(recipe);
            await context.SaveChangesAsync();

            return Ok();

        }
    }
}