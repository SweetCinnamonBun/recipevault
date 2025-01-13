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
        public async Task<IActionResult> GetRecipes([FromQuery] string? search, [FromQuery] List<string>? categories)
        {
            var query = context.Recipes.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(recipe => recipe.Name.Contains(search));
            }

            var recipes = await query.ToListAsync();

            return Ok(recipes);
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