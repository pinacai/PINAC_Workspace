import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean | undefined;
  onClose: () => void | Promise<void> | null;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/70 cursor-pointer"
        onClick={onClose}
      />
      <div className="bg-white rounded-lg shadow-lg z-10 p-8 max-w-md w-full">
        {children}
      </div>
    </div>
  );
};
