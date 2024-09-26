import React, { createContext, useState } from "react";

export const SubPageContext = createContext<{
  subPage: string;
  setSubPage: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface SubPageProviderProps {
  children: React.ReactNode;
}

export const SubPageProvider: React.FC<SubPageProviderProps> = ({
  children,
}) => {
  const [subPage, setSubPage] = useState("/settings");
  return (
    <SubPageContext.Provider value={{ subPage, setSubPage }}>
      {children}
    </SubPageContext.Provider>
  );
};
