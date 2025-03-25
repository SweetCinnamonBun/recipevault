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

    const deleteComment = useMutation({
        mutationFn: async (commentId:number) => {
            await agent.delete(`/api/comments/comments/${commentId}`, {
                withCredentials: true,
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["recipe-comments"]
            })
            toast.success("Comment deleted!");
        },
        onError: async () => {
            toast.error("Comment deletion failed");
        }
    })

    return {
        comments,
        addComment,
        deleteComment
    }
}