import { useCallback } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import useEmblaCarousel from "embla-carousel-react";
import { Recipe } from "@/types/Recipe";



interface Props {
  title?: string;
  recipes: Recipe[];
}

const CardCarousel = ({ title, recipes } : Props) => {
  const [emblaRef, embla] = useEmblaCarousel({ slidesToScroll: "auto" });

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section className="">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100"
            onClick={scrollPrev}
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>

          <button
            className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100"
            onClick={scrollNext}
          >
            <FaArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="embla__slide">
                <div className="overflow-hidden transition bg-white shadow rounded-xl hover:shadow-md">
                  <figure className="w-full h-72">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                  <div className="px-4 pb-4 mt-2 space-y-2">
                    <h3 className="text-xl font-medium">{recipe.name}</h3>
                    <div className="flex gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="px-1 py-1 bg-blue-200 rounded-full">
                          <MdAccessTime className="w-4 h-4" />
                        </div>
                        <span>{recipe.cookingTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-1 py-1 bg-blue-200 rounded-full">
                          <PiForkKnifeFill className="w-4 h-4" />
                        </div>
                        <span>{recipe.servingSize}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="px-1 py-1 bg-blue-200 rounded-full">
                          <FaStar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span>{recipe.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
