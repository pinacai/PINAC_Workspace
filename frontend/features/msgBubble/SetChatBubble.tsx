import React from "react";
import { AiMsgBubble } from "./AiMsgBubble";
import { UserMsgBubble } from "./UserMsgBubble";

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
        <AiMsgBubble response={msg} />
      )}
    </>
  );
};
