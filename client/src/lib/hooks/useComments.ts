import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { toast } from "react-toastify"

interface addComment {
    content: string
}


export const useComments = (recipeId?: string) => {

    const queryClient = useQueryClient();

    const { data: comments } = useQuery({
        queryKey: ["recipe-comments", recipeId],
        queryFn: async () => {
            const response = await agent.get<Comment[]>(`/api/comments/${recipeId}/comments`)
            return response.data;
        } 
    })

    const addComment = useMutation({
        mutationFn: async (comment:addComment) => {
            const response = await agent.post(`/api/comments/${recipeId}/comments`, comment, {
                withCredentials: true,
            })
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["recipe-comments"]
            }); 
            toast("Comment submitted successfully!");
        },
        onError: async () => {
            toast.error("Comment submission failed...");
        }
    })

    return {
        comments,
        addComment
    }
}