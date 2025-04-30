import React from "react";
import { AiMsgBubble } from "./AiBubble";
import { UserMsgBubble } from "./UserBubble";

interface SetChatBubbleProps {
  role: string;
  msg: string;
}

export const SetChatBubble: React.FC<SetChatBubbleProps> = ({ role, msg }) => {
  return (
    <>
      {role === "user" ? (
        <UserMsgBubble response={msg} />
      ) : (
        <AiMsgBubble live={false} response={msg} />
      )}
    </>
  );
};
