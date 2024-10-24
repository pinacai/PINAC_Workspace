import React, { createContext, useState, useEffect } from "react";

export const LLMSettingsContext = createContext<{
  modelType: string;
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  cloudModel: string;
  setCloudModel: React.Dispatch<React.SetStateAction<string>>;
  privateModel: string | null;
  setPrivateModel: React.Dispatch<React.SetStateAction<string | null>>;
  outputlanguage: string;
  setOutputlanguage: React.Dispatch<React.SetStateAction<string>>;
  setValue: (valueType: string, value: string) => void;
  getValue: (valueType: string) => string | null;
} | null>(null);

interface LLMSettingsProviderProps {
  children: React.ReactNode;
}

export const LLMSettingsProvider: React.FC<LLMSettingsProviderProps> = ({
  children,
}) => {
  const [modelType, setModelType] = useState(() => {
    const choice = localStorage.getItem("model-type");
    return choice ? choice : "Cloud LLM";
  });
  const [cloudModel, setCloudModel] = useState(() => {
    const choice = localStorage.getItem("cloud-model");
    return choice ? choice : "Llama 3";
  });

  const [privateModel, setPrivateModel] = useState(() => {
    const choice = localStorage.getItem("private-model");
    return choice ? choice : null;
  });

  const [outputlanguage, setOutputlanguage] = useState(() => {
    const choice = localStorage.getItem("output-language");
    return choice ? choice : "English";
  });

  const setValue = (valueType: string, value: string) => {
    if (valueType === "model_type") {
      setModelType(value);
    } else if (valueType === "cloud_model") {
      setCloudModel(value);
    } else if (valueType === "private_model") {
      setPrivateModel(value);
    } else if (valueType === "output_language") {
      setOutputlanguage(value);
    }
  };

  const getValue = (valueType: string) => {
    if (valueType === "model_type") {
      return modelType;
    } else if (valueType === "cloud_model") {
      return cloudModel;
    } else if (valueType === "private_model") {
      return privateModel;
    } else if (valueType === "output_language") {
      return outputlanguage;
    } else return null;
  };

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("model-type", modelType);
    localStorage.setItem("cloud-model", cloudModel);
    privateModel && localStorage.setItem("private-model", privateModel);
    localStorage.setItem("output-language", outputlanguage);
  }, [modelType, cloudModel, privateModel, outputlanguage]);

  return (
    <LLMSettingsContext.Provider
      value={{
        modelType,
        setModelType,
        cloudModel,
        setCloudModel,
        privateModel,
        setPrivateModel,
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
