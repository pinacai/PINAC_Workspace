import React from "react";
import styles from "../styles/NewChatBtn.module.css";

// Icons
import { IoAddCircleOutline } from "react-icons/io5";

interface NewChatBtnProps {
  clearChat: () => void;
}

export const NewChatBtn: React.FC<NewChatBtnProps> = ({ clearChat }) => {
  return (
    <>
      <button className={styles.newChatButton} onClick={clearChat}>
        <IoAddCircleOutline
          size={30}
          color="var(--text-color-light)"
          style={{ zIndex: 2 }}
        />
        <span>New Chat</span>
      </button>
    </>
  );
};
