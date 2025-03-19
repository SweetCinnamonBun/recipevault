import React, { useCallback, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import StarRating from "./StarRating";

interface RatingModalProps {
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ onClose, onSubmit }) => {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const handleClick = useCallback(
    (e) => {
      if (e.target === overlay.current) {
        onClose();
      }
    },
    [onClose, overlay],
  );

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => handleClick(e)}
    >
      <div
        ref={wrapper}
        className="relative px-4 pt-2 pb-10 bg-white rounded-lg lg:w-1/2 xl:w-1/2"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className=""
          >
            <IoMdClose className="h-7 w-7" />
          </button>
        </div>
        <div className="">
            <h1 className="text-2xl font-bold text-center">Rate this recipe!</h1>
            <div className="flex justify-center my-20">
                <StarRating initialRating={0} onRatingChange={onSubmit}/>
            </div>
        </div>
      </div>
    </div>
  );
}
export default RatingModal;