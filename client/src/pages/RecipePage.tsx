import {
  Category,
  Ingredient,
  Instruction,
  Recipe,
  RecipeComment,
} from "@/types/Recipe";
import { useCallback, useEffect, useState } from "react";
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
import useEmblaCarousel from "embla-carousel-react";
import { FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: "auto" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
        recipeId: id,
      };

      await addRating.mutateAsync(ratingObj);
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
    <div className="min-h-screen">
      <section className="flex flex-col items-center px-3 min-[1200px]:px-10">
        <div className="grid w-full gap-6 xl:grid-cols-2 xl:mt-8">
          <figure className="w-full px-1 mt-8 lg:mt-0  h-80 md:h-[596px] ">
            <img
              src={recipe?.imageUrl}
              alt={recipe?.name}
              className="object-center w-full h-full rounded-xl"
            />
          </figure>

          <div className="px-2 bg-orange-200 lg:p-4 rounded-xl">
            <h1 className="self-start mx-2 mt-4 text-2xl md:text-3xl xl:mt-2">
              {recipe?.name}
            </h1>
            {/* Categories */}
            <div className="flex flex-wrap self-start gap-1 mt-10">
              {recipe?.categories.map((category: Category, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 text-sm ml-1 bg-[#00FF9C] rounded-3xl"
                >
                  {category.name}
                </span>
              ))}
            </div>
            {/* Recipe basic info */}
            <div className="flex flex-wrap w-full py-5 mt-2 gap-y-3 gap-x-2">
              <div className="">
                <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                  <div className="px-2 py-2 bg-blue-200 rounded-full">
                    <MdAccessTime className="w-6 h-6 bg-gray-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm md:text-md">Cooking time</span>
                    <span className="text-md md:text-lg">
                      {recipe?.cookingTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                  <div className="px-2 py-2 bg-blue-200 rounded-full">
                    <PiShootingStarLight className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm md:text-md">Difficulty</span>
                    <span className="text-md md:text-lg">
                      {recipe?.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-[max-content_1fr] items-center gap-2">
                  <div className="px-2 py-2 bg-blue-200 rounded-full">
                    <PiForkKnifeFill className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm md:text-md">Serving Size</span>
                    <span className="text-md md:text-lg">
                      {recipe?.servingSize}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex self-start mb-4">
              <span className="text-md">
                <em>Recipe by:</em> <strong>{recipe?.user.profileName}</strong>
              </span>
            </div>
            <section className="w-full">
              <div className="w-full p-6 text-lg bg-white shadow-lg rounded-xl h-96 lg:h-56">
                {recipe?.description}
              </div>
            </section>

            {/* <div className="flex flex-col items-center mt-20">
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
        </div> */}
            <section className="flex items-center justify-end w-full my-6">
              <button
                type="button"
                className="px-3 py-2 text-sm text-white bg-red-600 rounded-2xl"
              >
                Download Recipe PDF
              </button>
            </section>
            {/* <div className="flex flex-col items-center gap-2 mt-14">
          <FaHeart
            className={`w-7 h-7 cursor-pointer ${
              isFavorite ? "text-red-500" : "text-black"
            }`}
            onClick={handleFavoriteToggle}
          />
          <span>
            {isFavorite ? "Remove from favorites" : "Add to your favorites"}
          </span>
        </div> */}
          </div>
        </div>
        {/* Ingredients section */}
        <section className="w-full mt-14 xl:w-3/5 xl:self-start">
          <div className=" px-4 py-2 pb-6 rounded-lg bg-[white] shadow-md">
            <h2 className="text-xl font-bold ">Ingredients</h2>
            <ul className="px-4 mt-4 space-y-1 list-disc ">
              {recipe?.ingredients.map((ingredient: Ingredient) => (
                <li className="space-x-2 text-lg">
                  <span>{ingredient.quantity}</span>
                  <span>{ingredient.unit}</span>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="w-full mt-10 xl:w-3/5 xl:self-start">
          <h2 className="text-xl font-bold">Cooking instructions</h2>

          <div className="py-2 rounded-lg ">
            <ul className="mt-4 space-y-2">
              {recipe?.instructions.map(
                (instruction: Instruction, index: number) => (
                  <li
                    key={instruction.id}
                    className="
              px-4 py-3
              text-lg
              bg-white
              rounded-md
              grid
              grid-cols-[max-content_1fr]
              items-center
              gap-3
            "
                  >
                    <span className="px-1 font-semibold">{index + 1}.</span>
                    <p className="min-w-0 break-words">{instruction.text}</p>
                  </li>
                )
              )}
            </ul>
          </div>
        </section>
        {/* More recipes from author */}
        <section className="mt-10 card-carousel">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">More recipes from author</h2>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-white rounded-lg shadow embla__prev hover:bg-gray-100"
                onClick={scrollPrev}
              >
                <FaArrowLeft className="w-6 h-6" />
              </button>

              <button
                className="px-4 py-2 bg-white rounded-lg shadow embla__next hover:bg-gray-100"
                onClick={scrollNext}
              >
                <FaArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                <div className="embla__slide">
                  <div className="w-full rounded-xl">
                    <figure className="h-72 rounded-xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </figure>
                    <div className="px-2 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="embla__slide">
                  <div className="w-full rounded-xl">
                    <figure className="h-72 rounded-xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </figure>
                    <div className="px-2 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="embla__slide">
                  <div className="w-full rounded-xl">
                    <figure className="h-72 rounded-xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </figure>
                    <div className="px-2 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="embla__slide">
                  <div className="w-full bg-white rounded-xl">
                    <figure className="h-72 rounded-xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </figure>
                    <div className="px-2 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="embla__slide">
                  <div className="w-full bg-white rounded-xl">
                    <figure className="h-72 rounded-xl">
                      <img
                        src={recipe?.imageUrl}
                        alt="recipe image"
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </figure>
                    <div className="px-2 pb-4 mt-2 space-y-2 card-body">
                      <h3 className="text-xl ">{recipe?.name}</h3>
                      <div className="flex gap-3 basic-info ">
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <MdAccessTime className="w-4 h-4" />
                          </div>
                          <span>{recipe?.cookingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <PiForkKnifeFill className="w-4 h-4" />
                          </div>
                          <span>{recipe?.servingSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-1 bg-blue-200 rounded-full">
                            <FaStar className="w-4 h-4" fill="yellow" />
                          </div>
                          <span>{recipe?.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      {/* Comments section */}
      <div className="w-full px-3 bg-white md:px-10 ">
        <section className="py-6 mx-auto mt-10 bg-white rounded-lg">
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
              comments?.map((comment: RecipeComment) => (
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
