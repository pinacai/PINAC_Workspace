import React, { useState, useEffect } from "react";
import styles from "../style/MessageBubble.module.css";

// Icons
import userIcon from "../../../assets/icon/user_icon.png";

interface UserMsgBubbleProps {
  response: string;
}

export const UserMsgBubble: React.FC<UserMsgBubbleProps> = (props) => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(
    window.innerWidth > 576
  ); // Initial state based on window size

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const updateAvatarVisibility = () => {
      setIsAvatarVisible(window.innerWidth > 576);
    };
    window.addEventListener("resize", updateAvatarVisibility);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", updateAvatarVisibility);
  }, []);

  // ----------------------------------------- //
  return (
    <>
      <div className={styles.msg_row}>
        {isAvatarVisible && (
          <div className={styles.msg_avatar}>
            <img src={userIcon} alt="User Avatar" />
          </div>
        )}
        <div className={styles.msg_content}>
          <div className={styles.msg_name}>You</div>
          <div className={`${styles.msg_text} ${styles.human_msg}`}>{props.response}</div>
        </div>
      </div>
    </>
  );
};
