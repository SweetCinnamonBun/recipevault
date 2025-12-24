import React, { useCallback, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function RecipePreviewModal({ children, onClose }) {
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
        className="relative px-4 pt-2 pb-10 bg-white rounded-lg lg:w-4/5"
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
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
