using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly BlogContext context;
        private readonly IWebHostEnvironment env;

        public RecipesController(BlogContext context, IWebHostEnvironment env)
        {
            this.context = context;
            this.env = env;
        }


        [HttpGet]
        public async Task<IActionResult> GetRecipes()
        {
            var recipes = await context.Recipes.ToListAsync();

            return Ok(recipes);
        }



        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromForm] CreateRecipeDto recipeDto)
        {
            if (recipeDto.ImageFile == null)
            {
                ModelState.AddModelError("ImageFile", "Please select and image");
                return BadRequest(ModelState);
            }

            string imageFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff");
            imageFileName += Path.GetExtension(recipeDto.ImageFile.FileName);

            string imagesFolder = env.WebRootPath + "/images/recipes/";

            using var stream = System.IO.File.Create(imagesFolder + imageFileName);
            recipeDto.ImageFile.CopyTo(stream);

            Recipe recipe = new()
            {
                Name = recipeDto.Name,
                CookingTime = recipeDto.CookingTime,
                ImageFileName = imageFileName
            };

            await context.Recipes.AddAsync(recipe);
            await context.SaveChangesAsync();

            return Ok(recipe);
        }
    }
}