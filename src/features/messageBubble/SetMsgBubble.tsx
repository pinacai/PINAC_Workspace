import React from "react";
import { AiMsgBubble } from "./AiBubble";
import { UserMsgBubble } from "./UserBubble";

interface SetChatBubbleProps {
  role: string;
  msg: string;
  attachment?: string;
}

export const SetChatBubble: React.FC<SetChatBubbleProps> = ({
  role,
  msg,
  attachment,
}) => {
  return (
    <>
      {role === "user" ? (
        <UserMsgBubble response={msg} attachment={attachment} />
      ) : (
        <AiMsgBubble live={false} response={msg} />
      )}
    </>
  );
};
