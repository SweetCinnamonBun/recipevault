import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  isOpen: boolean;
}

const CreatingRecipeModal: React.FC<Props> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
        <ClipLoader size={50} color="#36d7b7" />
        <h2 className="mt-4 text-2xl font-bold">Creating Recipe...</h2>
        <p className="mt-2 text-center text-gray-600">
          Please wait while we save your recipe.
        </p>
      </div>
    </div>
  );
};

export default CreatingRecipeModal;