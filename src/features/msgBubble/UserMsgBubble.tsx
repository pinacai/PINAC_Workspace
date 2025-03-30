import React from "react";
import { MarkdownStyle } from "../../components/MarkdownStyle";

interface UserMsgBubbleProps {
  response: string;
}

export const UserMsgBubble: React.FC<UserMsgBubbleProps> = ({ response }) => {
  return (
    <div className="flex justify-end">
      <div className="lg:max-w-[90%] px-4 py-2 rounded-2xl bg-gray-300 dark:bg-tertiary-dark text-lg text-gray-900 dark:text-white">
        <MarkdownStyle text={response} />
      </div>
    </div>
  );
};
