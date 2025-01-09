using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Instructions;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructionsController : ControllerBase
    {
        private readonly BlogContext context;

        public InstructionsController(BlogContext context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var instructions = await context.Instructions.ToListAsync();

            return Ok(instructions);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> CreateInstructionsForRecipe(int recipeId, List<CreateInstructionDto> instructionDtos)
        {

            var recipe = await context.Recipes.FindAsync(recipeId);
            if (recipe == null)
            {
                return NotFound($"Recipe with ID {recipeId} not found.");
            }

            var instructions = instructionDtos.Select(dto => new Instruction
            {

                Step = dto.Step,
                Text = dto.Text,
                RecipeId = recipeId
            }).ToList();

            await context.Instructions.AddRangeAsync(instructions);
            await context.SaveChangesAsync();

            return Ok(new { Message = $"{instructions.Count} instructions added successfully to recipe ID {recipeId}." });
        }

    }
}