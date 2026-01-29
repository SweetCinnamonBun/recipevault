import { Category, Recipe } from "@/types/Recipe";
import { FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router";

type RecipeCardProps = {
  recipe: Recipe;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <>
      <Link
        key={recipe.id}
        to={`/recipe/${recipe.id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="h-full bg-white rounded-2xl hover:shadow-md hover:bg-gray-50">
          <figure className="h-72">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="object-cover w-full h-full rounded-t-2xl"
            />
          </figure>

          <div className="px-4 pb-4 mt-2 space-y-2">
            <h3 className="text-xl font-medium">{recipe.name}</h3>

            <div className="flex gap-2">
              {recipe.categories?.slice(0, 2).map((category: Category) => (
                <span
                  key={category.slug}
                  className="px-3 py-1 text-sm bg-green-300 rounded-xl"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MdAccessTime />
                <span>{recipe.cookingTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <PiForkKnifeFill />
                <span>{recipe.servingSize}</span>
              </div>

              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span>{recipe.averageRating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default RecipeCard;
