using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.Account;
using API.DTOs.Category;
using API.DTOs.Ingredients;
using API.DTOs.Instructions;
using AutoMapper;
using Core.Entities;

namespace API.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Recipe, RecipeDto>().ReverseMap();
            CreateMap<Instruction, InstructionDto>().ReverseMap();
            CreateMap<Ingredient, IngredientDto>().ReverseMap();
            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<UpdateRecipeDto, RecipeDto>().ReverseMap();
            CreateMap<CreateRecipeDto, Recipe>().ReverseMap();

            CreateMap<AppUser, UserDto>().ReverseMap();

        }
    }
}