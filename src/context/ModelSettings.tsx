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
  privateModelName: string | null;
  setPrivateModelName: React.Dispatch<React.SetStateAction<string | null>>;
  outputlanguage: string;
  setOutputlanguage: React.Dispatch<React.SetStateAction<string>>;
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
    } else if (valueName === "img-model-name") {
      setImgModelName(value);
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
    } else if (valueName === "img-model-name") {
      return imgModelName;
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
    localStorage.setItem("img-model-name", imgModelName);
    localStorage.setItem("text-model-type", textModelType);
    localStorage.setItem("cloud-model-name", cloudModelName);
    privateModelName &&
      localStorage.setItem("private-model-name", privateModelName);
    localStorage.setItem("output-language", outputlanguage);
  }, [
    modelType,
    imgModelName,
    textModelType,
    cloudModelName,
    privateModelName,
    outputlanguage,
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
        privateModelName,
        setPrivateModelName,
        outputlanguage,
        setOutputlanguage,
        setValue,
        getValue,
      }}
    >
      {children}
    </ModelSettingsContext.Provider>
  );
};
