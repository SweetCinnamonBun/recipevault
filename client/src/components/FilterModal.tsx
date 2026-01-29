import { useCallback, useRef, ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

type FiltersModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const FiltersModal = ({ children, onClose }: FiltersModalProps) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlay.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={overlay}
      className="fixed top-0 bottom-0 left-0 right-0 z-10 mx-auto bg-black/80"
      onClick={handleClick}
    >
      <div
        ref={wrapper}
        className="flex justify-start items-center flex-col absolute h-[95%] w-full bottom-0 bg-white rounded-t-3xl lg:px-40 px-8 pt-14 pb-72 overflow-auto"
      >
        {/* Close button */}
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            <IoMdClose className="h-7 w-7" />
          </button>
        </div>

        {/* Modal content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default FiltersModal;
