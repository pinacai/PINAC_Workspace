import React, { useContext } from "react";
import { WelcomeTextContext } from "../../../context/WelcomeText";
import { ChatMsgContext } from "../../../context/ChatMsg";
import { getSession, deleteSession} from "../../../database/db";
import { SetChatBubble } from "../../msgBubble/SetChatBubble";
import { MdDelete } from "react-icons/md";
import styles from "../styles/SessionCard.module.css";

interface SessionCardProps {
  sessionId: string;
  date: string;
  title: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  sessionId,
  date,
  title,
}) => {
  const welcomeTextContext = useContext(WelcomeTextContext);
  const chatContext = useContext(ChatMsgContext);

  const fetchChat = () => {
    getSession(sessionId).then((session) => {
      welcomeTextContext?.setIsWelcomeTextVisible(false);
      chatContext?.setCurrentSessionId(sessionId);
      chatContext?.setChatMsg(
        session
          ? session.messages.map((msg) => {
              return {
                key: msg.id,
                element: [
                  msg.id,
                  msg.role,
                  msg.text,
                  <SetChatBubble role={msg.role} msg={msg.text} />,
                ],
              };
            })
          : []
      );
    });
  };

  const handleDeletion = () => {
    deleteSession(sessionId)
    .then(() => {
      console.log("Session deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting session:", error);
    });
};


  return (
    <div className={styles.sessionCardContainer}>
	  <div className={styles.sessionCard} onClick={fetchChat}>
        <div className={styles.dateBlock}>
          <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.titleBlock}>
          <span className={styles.title}>{title}</span>
        </div>
	  </div>
	  <div className={styles.deleteButtonContainer}>
	    <button className={styles.deleteButton} onClick={handleDeletion} ><MdDelete/></button>
	  </div>
    </div>
  );
};
