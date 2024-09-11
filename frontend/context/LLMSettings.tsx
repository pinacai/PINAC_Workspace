import React, { createContext, useState } from "react";

export const LLMSettingsContext = createContext<{
  modelType: string;
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  cloudModel: string;
  setCloudModel: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface LLMSettingsProviderProps {
  children: React.ReactNode;
}

export const LLMSettingsProvider: React.FC<LLMSettingsProviderProps> = ({
  children,
}) => {
  const [modelType, setModelType] = useState("Cloud LLM");
  const [cloudModel, setCloudModel] = useState("Llama 3");

  return (
    <LLMSettingsContext.Provider
      value={{ modelType, setModelType, cloudModel, setCloudModel }}
    >
      {children}
    </LLMSettingsContext.Provider>
  );
};
