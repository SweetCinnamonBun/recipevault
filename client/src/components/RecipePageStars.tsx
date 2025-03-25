import { FaStar } from 'react-icons/fa';



const RecipePageStars = ({averageRating}: {averageRating: number}) => {
  return (
    <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
            <FaStar
                key={i}
                className="w-10 h-10"
                color={i < Math.round(averageRating) ? "#f8ec07" : "black"}
            />
        ))}
    </div>
);
}

export default RecipePageStars