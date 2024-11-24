import React, { createContext, useState, useEffect } from "react";

export const ModelSettingsContext = createContext<{
  modelType: string;
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  imgModelName: string;
  setImgModelName: React.Dispatch<React.SetStateAction<string>>;
  textModelType: string;
  setTextModelType: React.Dispatch<React.SetStateAction<string>>;
  cloudModelName: string;
  setCloudModelName: React.Dispatch<React.SetStateAction<string>>;
  deepthink: boolean;
  setDeepthink: React.Dispatch<React.SetStateAction<boolean>>;
  ollamaModelName: string | null;
  setOllamaModelName: React.Dispatch<React.SetStateAction<string | null>>;
  outputLanguage: string;
  setOutputLanguage: React.Dispatch<React.SetStateAction<string>>;
  setValue: (valueName: string, value: string) => void;
  getValue: (valueName: string) => string | null;
} | null>(null);

interface ModelSettingsProviderProps {
  children: React.ReactNode;
}

export const ModelSettingsProvider: React.FC<ModelSettingsProviderProps> = ({
  children,
}) => {
  const [modelType, setModelType] = useState(() => {
    const choice = localStorage.getItem("model-type");
    return choice ? choice : "Text Generation";
  });

  const [imgModelName, setImgModelName] = useState(() => {
    const choice = localStorage.getItem("img-model-name");
    return choice ? choice : "Flux.1 Dev";
  });

  const [textModelType, setTextModelType] = useState(() => {
    const choice = localStorage.getItem("text-model-type");
    return choice ? choice : "Cloud LLM";
  });

  const [cloudModelName, setCloudModelName] = useState(() => {
    const choice = localStorage.getItem("cloud-model-name");
    return choice ? choice : "Base Model";
  });

  const [deepthink, setDeepthink] = useState(false);

  const [ollamaModelName, setOllamaModelName] = useState(() => {
    const choice = localStorage.getItem("ollama-model-name");
    return choice ? choice : null;
  });

  const [outputLanguage, setOutputLanguage] = useState(() => {
    const choice = localStorage.getItem("output-language");
    return choice ? choice : "English";
  });

  const setValue = (valueName: string, value: string) => {
    if (valueName === "model-type") {
      setModelType(value);
    } else if (valueName === "img-model-name") {
      setImgModelName(value);
    } else if (valueName === "text-model-type") {
      setTextModelType(value);
    } else if (valueName === "cloud-model-name") {
      setCloudModelName(value);
    } else if (valueName === "ollama-model-name") {
      setOllamaModelName(value);
    } else if (valueName === "output-language") {
      setOutputLanguage(value);
    }
  };

  const getValue = (valueName: string) => {
    if (valueName === "model-type") {
      return modelType;
    } else if (valueName === "img-model-name") {
      return imgModelName;
    } else if (valueName === "text-model-type") {
      return textModelType;
    } else if (valueName === "cloud-model-name") {
      return cloudModelName;
    } else if (valueName === "ollama-model-name") {
      return ollamaModelName;
    } else if (valueName === "output-language") {
      return outputLanguage;
    } else return null;
  };

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("model-type", modelType);
    localStorage.setItem("img-model-name", imgModelName);
    localStorage.setItem("text-model-type", textModelType);
    localStorage.setItem("cloud-model-name", cloudModelName);
    ollamaModelName &&
      localStorage.setItem("ollama-model-name", ollamaModelName);
    localStorage.setItem("output-language", outputLanguage);
  }, [
    modelType,
    imgModelName,
    textModelType,
    cloudModelName,
    ollamaModelName,
    outputLanguage,
  ]);

  return (
    <ModelSettingsContext.Provider
      value={{
        modelType,
        setModelType,
        imgModelName,
        setImgModelName,
        textModelType,
        setTextModelType,
        cloudModelName,
        setCloudModelName,
        deepthink,
        setDeepthink,
        ollamaModelName,
        setOllamaModelName,
        outputLanguage,
        setOutputLanguage,
        setValue,
        getValue,
      }}
    >
      {children}
    </ModelSettingsContext.Provider>
  );
};
