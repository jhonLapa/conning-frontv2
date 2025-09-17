
import { createPortal } from "react-dom";

const MenuOverlayPortal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={() => {
        onClose();
      }}
      className="bg-black/60 backdrop-filter backdrop-blur-sm fixed w-full h-full flex-1 inset-0 z-50 rounded-md"
    ></div>,
    document.body
  );
};

export default MenuOverlayPortal;
