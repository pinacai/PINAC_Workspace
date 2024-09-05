import React, { createContext, useState } from "react";

export const ChatMsgContext = createContext<{
  chatMsg: ChatMessage[];
  setChatMsg: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
} | null>(null);

interface ChatMsgProviderProps {
  children: React.ReactNode;
}

interface ChatMessage {
  key: number;
  element: [number, string, string, JSX.Element]; // [ id, role, text, jsx ]
}

export const ChatMsgProvider: React.FC<ChatMsgProviderProps> = ({
  children,
}) => {
  const [chatMsg, setChatMsg] = useState<ChatMessage[]>([]);
  return (
    <ChatMsgContext.Provider value={{ chatMsg, setChatMsg }}>
      {children}
    </ChatMsgContext.Provider>
  );
};
