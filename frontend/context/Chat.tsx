import React, {
  useRef,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { startNewSession, addMsgToSession } from "../database/db";

interface ChatMessage {
  key: string;
  element: [string, string, string, JSX.Element]; // [ id, role, text, jsx ]
}

interface ChatContextType {
  chat: ChatMessage[];
  setChatMsg: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chat, setChatMsg] = useState<ChatMessage[]>([]);
  const currentSessionId = useRef<string | null>(null);

  useEffect(() => {
    const initializeSession = () => {
      if (
        chat.length > 0 &&
        currentSessionId.current == null
      ) {
        currentSessionId.current = `${new Date().toLocaleString()}`;
        if (currentSessionId.current != null) {
          startNewSession(currentSessionId.current, "New Session");
          const newMsg = chat[chat.length - 1];
          addMsgToSession(
            currentSessionId.current,
            newMsg.element[0],
            newMsg.element[1],
            newMsg.element[2]
          );
        }
      } else if (
        chat.length > 0 &&
        currentSessionId.current != null &&
        chat[chat.length - 1].element[1] != "aiLoader"
      ) {
        const newMsg = chat[chat.length - 1];
        addMsgToSession(
          currentSessionId.current,
          newMsg.element[0],
          newMsg.element[1],
          newMsg.element[2]
        );
      }
    };
    initializeSession();
  }, [currentSessionId, chat]);

  return (
    <ChatContext.Provider value={{ chat, setChatMsg }}>
      {children}
    </ChatContext.Provider>
  );
};
