import React, { createContext, useState, ReactNode } from 'react';

interface ChatMessage {
  key: number;
  element: [JSX.Element, string];
}
 
interface ChatContextType {
  chat: ChatMessage[];
  setChatMsg: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chat, setChatMsg] = useState<ChatMessage[]>([]);

  return (
    <ChatContext.Provider value={{ chat, setChatMsg }}>
      {children}
    </ChatContext.Provider>
  );
};
