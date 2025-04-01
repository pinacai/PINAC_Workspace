import React, { useContext } from "react";
import { WelcomeTextContext } from "../../../context/WelcomeText";
import { ChatMsgContext } from "../../../context/ChatMsg";
import { getSession } from "../../../database/db";
// import { deleteSession } from "../../../database/db";
import { SetChatBubble } from "../../msgBubble/SetChatBubble";
import { IoIosMore } from "react-icons/io";
// import { MdDelete } from "react-icons/md";

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

  // const handleDeletion = () => {
  //   deleteSession(sessionId).catch((error) => {
  //     console.error("Error deleting session:", error);
  //   });
  // };

  return (
    <div
      className="w-full mb-2 p-3 pt-2 flex flex-col rounded-2xl cursor-pointer border
      lg:bg-transparent dark:lg:bg-transparent lg:border-gray-700 dark:lg:border-primary-dark lg:hover:bg-gray-700 dark:lg:hover:bg-primary-dark
      bg-gray-200 dark:bg-zinc-800 border-gray-300 hover:border-gray-400 dark:border-zinc-700 hover:bg-gray-300 dark:hover:bg-primary-dark"
      onClick={fetchChat}
    >
      <div className="w-full flex items-center justify-between text-xs text-gray-600 lg:text-gray-400 dark:text-zinc-500">
        {date}
        <button className="cursor-pointer hover:bg-gray-800 dark:hover:bg-secondary-dark p-0.5 rounded-full">
          <IoIosMore size={20} />
        </button>
      </div>
      <div className="w-full flex items-center justify-start text-md mt-0.5">
        <p
          className="text-foreground max-w-full overflow-hidden whitespace-nowrap text-ellipsis
          dark:text-gray-200"
        >
          {title}
        </p>
      </div>
    </div>
  );
};
