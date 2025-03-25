import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
    initialRating: number | null; // Initial rating, passed from the parent component
    onRatingChange?: (rating: number) => void; // Callback to update rating in the parent component
}

const StarRating: React.FC<StarRatingProps> = ({ initialRating, onRatingChange }) => {
    const [rating, setRating] = useState<number | null>(initialRating);
    const [hover, setHover] = useState<number | null>(null);

    useEffect(() => {
        setRating(initialRating); // Update the rating if initialRating changes
    }, [initialRating]);

    const handleRatingChange = (ratingValue: number) => {
        setRating(ratingValue);
        onRatingChange(ratingValue); // Notify parent about the new rating
    };

    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={ratingValue} className="relative">
                        {/* Hidden radio button for form submission */}
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => handleRatingChange(ratingValue)}
                            className="hidden"
                        />
                        <FaStar
                            className="w-10 h-10 cursor-pointer"
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseOver={() => setHover(ratingValue)}
                            onMouseOut={() => setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
