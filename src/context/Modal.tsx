import React, { createContext, useState, ReactNode } from "react";

// types of content the modal can display
export type ModalContentType = "settings" | "embedding-model-downloader" | null;

export const ModalContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalContent: ModalContentType;
  setModalContent: React.Dispatch<React.SetStateAction<ModalContentType>>;
} | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContentType>(null);

  return (
    <ModalContext.Provider
      value={{ isOpen, setIsOpen, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};
