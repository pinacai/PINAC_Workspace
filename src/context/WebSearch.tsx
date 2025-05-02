import React, { createContext, useState } from "react";

export const WebSearchContext = createContext<{
  webSearch: boolean;
  setIsWebSearch: React.Dispatch<React.SetStateAction<boolean>>;
  quickSearch: boolean;
  setIsQuickSearch: React.Dispatch<React.SetStateAction<boolean>>;
  betterSearch: boolean;
  setIsBetterSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setQuickSearch: (value: boolean) => void;
  setBetterSearch: (value: boolean) => void;
} | null>(null);

interface WebSearchProviderProps {
  children: React.ReactNode;
}

export const WebSearchProvider: React.FC<WebSearchProviderProps> = ({
  children,
}) => {
  const [webSearch, setIsWebSearch] = useState<boolean>(false);
  const [quickSearch, setIsQuickSearch] = useState<boolean>(false);
  const [betterSearch, setIsBetterSearch] = useState<boolean>(false);

  const setQuickSearch = (value: boolean) => {
    setIsQuickSearch(value);
    setIsBetterSearch(!value);
  };

  const setBetterSearch = (value: boolean) => {
    setIsBetterSearch(value);
    setIsQuickSearch(!value);
  };

  return (
    <WebSearchContext.Provider
      value={{
        webSearch,
        setIsWebSearch,
        quickSearch,
        setIsQuickSearch,
        betterSearch,
        setIsBetterSearch,
        setQuickSearch,
        setBetterSearch,
      }}
    >
      {children}
    </WebSearchContext.Provider>
  );
};
