import React from "react";

// Icons
import { IoAddCircleOutline } from "react-icons/io5";

interface NewChatBtnProps {
  clearChat: () => void;
}

export const NewChatBtn: React.FC<NewChatBtnProps> = ({ clearChat }) => {
  return (
    <>
      <button
        className="newChatButton before:bg-gray-800 dark:before:bg-secondary-dark"
        onClick={clearChat}
      >
        <IoAddCircleOutline size={30} className="z-10" />
        <span>New Chat</span>
      </button>
    </>
  );
};
