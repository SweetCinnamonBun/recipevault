import { Recipe, RecipeCreate, RecipeUpdate } from "@/types/Recipe"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify";
import { Filters } from "@/pages/RecipesPage";

export const useRecipes = (id?: string) => {

    const queryClient = useQueryClient();

    const { data: recipe, isLoading:isLoadingRecipe } = useQuery<Recipe>({
        queryKey: ["recipe", id],
        queryFn: async () => {
            const response = await agent.get(`/api/recipes/${id}`)
            return response.data;
        },
        staleTime: 20_000,
        refetchOnWindowFocus: false
    })

    const createRecipe = useMutation({
        mutationFn: async (recipe: RecipeCreate) => {
            const response = await agent.post("/api/recipes", recipe, {
                withCredentials: true,
            })
            return response.data;
        },
        onSuccess: async () => {
           await queryClient.invalidateQueries({
            queryKey: ["users-recipes"]
           })
        },
        onError: async () => {
            console.error("Failed to create recipe")
        }   
    })

    const updateRecipe = useMutation({
        mutationFn: async (recipe: RecipeUpdate) => {
            await agent.put(`/api/recipes/${id}`, recipe, {
                withCredentials: true
            })
        },
        onSuccess: async () => {
           await queryClient.invalidateQueries({
            queryKey: ["recipe", id]
           }) 
           toast.success("Recipe updated!")
        },
        onError: async () => {
            console.error("Failed to create recipe")
            toast.error("Failed to update recipe...")
        }   
    })

    const deleteRecipe = useMutation({
        mutationFn: async (recipeId:number) => {
            return toast.promise(
                agent.delete(`api/recipes/${recipeId}`, { withCredentials: true }),
                {
                    pending: "Deleting recipe...",
                    success: "Recipe deleted successfully!",
                    error: "Failed to delete recipe. Please try again.",
                }
            );
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["users-recipes"]
            })
            await queryClient.invalidateQueries({
                queryKey: ["recipes"]
            })
        },
        onError: async (error) => {
            console.error("something went wrong...", error)
        }
    })

    return {
        createRecipe,
        deleteRecipe,
        recipe,
        isLoadingRecipe,
        updateRecipe
    }
}




export const useFetchRecipes = (filters: Filters) => {
  const {
    search = "",
    page = 1,
    pageSize = 12,
    categories = [],
    sortBy = "createdAt",
    isAscending = false,
  } = filters;

  const categoryQuery = categories.map((c) => `categories=${encodeURIComponent(c)}`).join("&");

  const queryString = `/api/recipes?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
    search
  )}&${categoryQuery}&sortBy=${sortBy}&isAscending=${isAscending}`;


  const { data: recipes, isLoading } = useQuery({
    queryKey: ["all-recipes", filters],
    queryFn: async () => {
      const response = await agent.get(queryString);
      // ✅ Ensure data is always an array
      return response.data
    },
    refetchOnWindowFocus: false,
    staleTime: 20_000
  });

  return { recipes, isLoading };
};
