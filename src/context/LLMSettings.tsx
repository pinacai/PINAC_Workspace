import React, { createContext, useState, useEffect } from "react";

export const LLMSettingsContext = createContext<{
  modelType: string;
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  textModelType: string;
  setTextModelType: React.Dispatch<React.SetStateAction<string>>;
  cloudModelName: string;
  setCloudModelName: React.Dispatch<React.SetStateAction<string>>;
  privateModelName: string | null;
  setPrivateModelName: React.Dispatch<React.SetStateAction<string | null>>;
  outputlanguage: string;
  setOutputlanguage: React.Dispatch<React.SetStateAction<string>>;
  setValue: (valueName: string, value: string) => void;
  getValue: (valueName: string) => string | null;
} | null>(null);

interface LLMSettingsProviderProps {
  children: React.ReactNode;
}

export const LLMSettingsProvider: React.FC<LLMSettingsProviderProps> = ({
  children,
}) => {
  const [modelType, setModelType] = useState(() => {
    const choice = localStorage.getItem("model-type");
    return choice ? choice : "text Generation";
  });
  const [textModelType, setTextModelType] = useState(() => {
    const choice = localStorage.getItem("text-model-type");
    return choice ? choice : "Cloud LLM";
  });
  const [cloudModelName, setCloudModelName] = useState(() => {
    const choice = localStorage.getItem("cloud-model-name");
    return choice ? choice : "Llama 3";
  });

  const [privateModelName, setPrivateModelName] = useState(() => {
    const choice = localStorage.getItem("private-model-name");
    return choice ? choice : null;
  });

  const [outputlanguage, setOutputlanguage] = useState(() => {
    const choice = localStorage.getItem("output-language");
    return choice ? choice : "English";
  });

  const setValue = (valueName: string, value: string) => {
    if (valueName === "model-type") {
      setModelType(value);
    } else if (valueName === "text-model-type") {
      setTextModelType(value);
    } else if (valueName === "cloud-model-name") {
      setCloudModelName(value);
    } else if (valueName === "private-model-name") {
      setPrivateModelName(value);
    } else if (valueName === "output-language") {
      setOutputlanguage(value);
    }
  };

  const getValue = (valueName: string) => {
    if (valueName === "model-type") {
      return modelType;
    } else if (valueName === "text-model-type") {
      return textModelType;
    } else if (valueName === "cloud-model-name") {
      return cloudModelName;
    } else if (valueName === "private-model-name") {
      return privateModelName;
    } else if (valueName === "output-language") {
      return outputlanguage;
    } else return null;
  };

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("model-type", modelType);
    localStorage.setItem("text-model-type", textModelType);
    localStorage.setItem("cloud-model-name", cloudModelName);
    privateModelName &&
      localStorage.setItem("private-model-name", privateModelName);
    localStorage.setItem("output-language", outputlanguage);
  }, [
    modelType,
    textModelType,
    cloudModelName,
    privateModelName,
    outputlanguage,
  ]);

  return (
    <LLMSettingsContext.Provider
      value={{
        modelType,
        setModelType,
        textModelType,
        setTextModelType,
        cloudModelName,
        setCloudModelName,
        privateModelName,
        setPrivateModelName,
        outputlanguage,
        setOutputlanguage,
        setValue,
        getValue,
      }}
    >
      {children}
    </LLMSettingsContext.Provider>
  );
};
