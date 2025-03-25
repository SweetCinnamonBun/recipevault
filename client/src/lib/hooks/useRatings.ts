import { useMutation, useQuery } from "@tanstack/react-query"
import agent from "../api/agent"

export const useRatings = (recipeId?: string) => {

    const { data:recipeRatings, isLoading:isLoadingRatings } = useQuery({
        queryKey: ["ratings", recipeId],
        queryFn: async () => {
            const response = await agent.get(`/api/ratings/recipe/${recipeId}/average`);
            return response.data;
        }
    })

    const addRating = useMutation({
        mutationFn: async () => {

        }
    })

    return {
        recipeRatings,
        isLoadingRatings,
        addRating
    }
}