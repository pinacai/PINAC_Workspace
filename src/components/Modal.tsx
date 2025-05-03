import React, { useContext } from "react";
import { ModalContext } from "../context/Modal";
import { Settings } from "../features/appSettings";

const Modal: React.FC = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext?.isOpen) return null;

  const handleModalClose = () => {
    if (modalContext) {
      modalContext.setIsOpen(false);
      modalContext.setModalContent(null);
    }
  };

  const renderModalContent = () => {
    switch (modalContext?.modalContent) {
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/70 dark:bg-zinc-900/5 backdrop-blur-sm"
        onClick={handleModalClose}
      />
      <div className=" rounded-lg shadow-lg z-50">{renderModalContent()}</div>
    </div>
  );
};

export default Modal;
