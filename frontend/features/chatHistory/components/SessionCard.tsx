import React, { useContext } from "react";
import { WelcomeTextContext } from "../../../context/WelcomeText";
import { ChatMsgContext } from "../../../context/ChatMsg";
import { getSession } from "../../../database/db";
import { SetChatBubble } from "../../msgBubble/SetChatBubble";
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

  return (
    <div className={styles.sessionCard} onClick={() => fetchChat()}>
      <div className={styles.dateBlock}>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.titleBlock}>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};
