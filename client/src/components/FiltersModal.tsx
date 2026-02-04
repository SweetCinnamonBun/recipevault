import { useRef, useCallback } from "react";
import { IoMdClose } from "react-icons/io";

type FiltersModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const FiltersModal = ({ children, onClose }: FiltersModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      {/* Modal */}
      <div className="w-full bg-white rounded-t-3xl shadow-xl max-h-[90%] overflow-auto px-6 pt-6 pb-12">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            <IoMdClose className="h-7 w-7" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default FiltersModal;

