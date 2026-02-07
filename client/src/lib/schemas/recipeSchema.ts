
import {z} from "zod"

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} is required` })
    .min(1, { message: `${fieldName} is required` })

export const recipeSchema = z.object({
    name: requiredString("Name"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    cookingTime: z.string({ required_error: "Cooking time is required."}),
    difficulty: z.string({required_error: "difficulty is required"}),
    servingSize: z.number().min(1, "Serving size must be at least 1")
})

export type RecipeSchema = z.infer<typeof recipeSchema>;