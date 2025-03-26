import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify"

interface AddRating {
    value: number,
    recipeId?: string
}

export const useRatings = (recipeId?: string) => {

    const queryClient = useQueryClient();

    const { data:recipeRatings, isLoading:isLoadingRatings } = useQuery({
        queryKey: ["ratings", recipeId],
        queryFn: async () => {
            const response = await agent.get(`/api/ratings/recipe/${recipeId}/average`);
            return response.data.rating;
        },
        staleTime: 20_000,
        refetchOnWindowFocus: false
    })

    const addRating = useMutation({
        mutationFn: async (rating: AddRating) => {
            await agent.post(`/api/ratings`, rating, {
                withCredentials: true
            })
        },
        onSuccess: async () => {
            toast.success("Rating submitted successfully.");
            await queryClient.invalidateQueries({
                queryKey: ["ratings", recipeId], 
            });
        },
        onError: async () => {
            toast.error("Rating submission failed.");
        }
    })

    return {
        recipeRatings,
        isLoadingRatings,
        addRating
    }
}