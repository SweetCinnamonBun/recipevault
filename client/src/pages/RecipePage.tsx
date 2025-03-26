import { Category, Ingredient, Instruction, Recipe, RecipeComment } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill, PiShootingStarLight } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import RatingModal from "@/components/RatingModal";
import { toast } from "react-toastify";

import { useRecipes } from "@/lib/hooks/useRecipes";
import { useRatings } from "@/lib/hooks/useRatings";
import { ClipLoader } from "react-spinners";
import { useComments } from "@/lib/hooks/useComments";
import RecipePageStars from "@/components/RecipePageStars";
import { RootState } from "@/store/store";

const RecipePage = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
  });
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const { recipe, isLoadingRecipe } = useRecipes(id);
  const { recipeRatings, isLoadingRatings, addRating } = useRatings(id);
  

  const { comments, addComment, deleteComment } = useComments(id);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/favorites/my-favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch favorites");
          return;
        }

        const favorites = await response.json();
        setIsFavorite(
          favorites.some((fav: Recipe) => fav.id === parseInt(id!))
        );
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    checkIfFavorite();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    const url = `/api/favorites/${id}`;
    const method = isFavorite ? "DELETE" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
      });

      if (response.ok) {
        setIsFavorite((prev) => !prev);
        toast(
          isFavorite
            ? "Recipe removed from favorites"
            : "Recipe added to favorites"
        );
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to toggle favorite.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleSubmitComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    try {
      await addComment.mutateAsync(newComment);
      setNewComment({ content: "" });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
            
      await deleteComment.mutateAsync(commentId);

    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleRatingSubmit = async (newRating: number) => {
    if (!user) {
      alert("You must be logged in to rate this recipe.");
      return;
    }

    try {
      
      const ratingObj = {
        value: newRating,
        recipeId: id
      }

      await addRating.mutateAsync(ratingObj)
      setIsRatingModalOpen(false);

    } catch (error) {
      console.error("Error submitting rating:", error);
      setIsRatingModalOpen(false);
    }
  };


  if (isLoadingRecipe) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#0a0301" size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="p-10 my-5 text-2xl text-center md:text-3xl">
        {recipe?.name}
      </h1>

      <div className="flex justify-between px-5 py-5 mt-2 mb-8 w-96 gap-x-5">
        <div className="">
          <div className="flex flex-col items-center">
            <MdAccessTime className="w-8 h-8" />
            <span className="text-md md:text-lg">{recipe?.cookingTime}</span>
            <span className="text-sm md:text-md">Cooking time</span>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center">
            <PiShootingStarLight className="w-8 h-8" />
            <span className="text-md md:text-lg">{recipe?.difficulty}</span>
            <span className="text-sm md:text-md">Difficulty</span>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center">
            <PiForkKnifeFill className="w-8 h-8" />
            <span className="text-md md:text-lg">{recipe?.servingSize}</span>
            <span className="text-sm md:text-md">Serving Size</span>
          </div>
        </div>
      </div>

      <figure className="w-full sm:w-3/4 px-1 lg:w-[70%] [@media(min-width:1100px)]:w-[60%] [@media(min-width:1300px)]:w-[50%] 2xl:w-[50%] [@media(min-width:1750px)]:w-[40%]">
        <img
          src={recipe?.imageUrl}
          alt={recipe?.name}
          className="w-full h-[380px] md:h-[520px] rounded-xl"
        />
      </figure>
      <div className="flex mt-10">
        <span className="text-lg"><em>Recipe by:</em> <strong>{recipe?.user.profileName}</strong></span>
      </div>
      <div className="flex flex-wrap justify-center mt-12 gap-y-5">
        {recipe?.categories.map((category: Category, index:number) => (
          <span key={index} className="px-4 py-2 ml-4 bg-[#00FF9C] rounded-lg">
            {category.name}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center mt-20">
        {isLoadingRatings ? (
          <p>loading ratings...</p>
        ) : (
          <RecipePageStars averageRating={recipeRatings} />
        )}
        <div className="mt-3">
          {recipe?.ratingCount === 0 ? (
            <span>No ratings for this recipe</span>
          ) : (
            <span className="">
              {recipe?.ratingCount} ratings. Average: {recipe?.averageRating}
            </span>
          )}
        </div>
        <div className="mt-8">
          <button
            className="px-4 py-2 font-bold bg-yellow-300 rounded-lg"
            onClick={() => setIsRatingModalOpen(true)}
          >
            Rate this recipe
          </button>
          {isRatingModalOpen && (
            <RatingModal
              onSubmit={handleRatingSubmit}
              onClose={() => setIsRatingModalOpen(false)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-14">
        <FaHeart
          className={`w-7 h-7 cursor-pointer ${
            isFavorite ? "text-red-500" : "text-black"
          }`}
          onClick={handleFavoriteToggle}
        />
        <span>
          {isFavorite ? "Remove from favorites" : "Add to your favorites"}
        </span>
      </div>
      <section className="w-11/12 my-10 2xl:px-52">
        <div className="w-full p-4 text-xl bg-white shadow-lg rounded-xl h-96">
          {recipe?.description}
        </div>
      </section>
      <section className="grid w-11/12 gap-y-4 grid-cols-1 md:grid-cols-2  md:h-[750px] gap-x-8 2xl:px-52">
        <div className="p-6  rounded-lg bg-[#F8FAE5] shadow-lg">
          <h2 className="my-2 text-2xl font-bold">Ingredients</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.ingredients.map((ingredient: Ingredient) => (
              <li className="space-x-2 text-xl">
                <span>{ingredient.quantity}</span>
                <span>{ingredient.unit}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-lg bg-[#F8FAE5] shadow-lg min-w-0">
          <h2 className="my-2 text-2xl font-bold">Instructions</h2>
          <ul className="p-2 space-y-4 list-disc">
            {recipe?.instructions.map((instruction: Instruction) => (
              <li className="text-xl break-words">{instruction.text}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="w-full 2xl:px-56">
        <section className="w-11/12 p-6 mx-auto my-10 bg-white rounded-lg">
          <h2 className="text-2xl font-bold">Comments</h2>

          {/* Comment Submission Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Write a comment..."
                value={newComment.content}
                onChange={(e) =>
                  setNewComment((prev) => {
                    return {
                      ...prev,
                      content: e.target.value,
                    };
                  })
                }
              />
              <button
                type="submit"
                className={`px-4 py-2 mt-2 text-white rounded-lg ${
                  addComment.isPending
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-black"
                }`}
                disabled={addComment.isPending}
              >
                {addComment.isPending ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="mt-4 ">
            {comments?.length === 0 ? (
              <p className="pt-5 my-4 text-lg font-bold">
                There are no comments for this recipe.
              </p>
            ) : (
              comments?.map((comment:RecipeComment) => (
                <div
                  key={comment.id}
                  className="pt-4 my-2 space-y-2 border-b border-gray-300 pb-7"
                >
                  <div className="flex justify-between">
                    <strong>{comment.user?.userName || "Anonymous"}:</strong>
                    {user && user.email === comment.user?.userName && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-2 text-sm text-red-500 "
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipePage;
