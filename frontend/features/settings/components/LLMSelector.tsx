import React, { useRef, useEffect } from "react";
import { DropdownMenu } from "./DropdownMenu";
import styles from "../styles/LLMSelector.module.css";

interface LLMSelectorProps {
  selectedLlmType: string;
  setSelectedLlmType: (value: string) => void;
}

export const LLMSelector: React.FC<LLMSelectorProps> = ({
  selectedLlmType,
  setSelectedLlmType,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const changePreferredModel = () => {
    const modelName = inputRef.current?.value;
    if (modelName) {
      localStorage.setItem("preferred-private-model", modelName);
    }
  };

  //
  useEffect(() => {
    if (selectedLlmType !== "Cloud LLM") {
      const preferredModel = localStorage.getItem("preferred-private-model");
      if (preferredModel && inputRef.current) {
        inputRef.current.value = preferredModel;
      }
    }
  }, [selectedLlmType]);

  // -------------------------------- //
  return (
    <div className={styles.llmSelectionContainer}>
      {/* Dropdown menu for selecting the LLM type */}
      {/* ---------------------------------------- */}
      <DropdownMenu
        defaultOption="Cloud LLM"
        optionList={["Cloud LLM", "Private LLM"]}
        localStorageVariableName="preferred-model-type"
        updateValue={setSelectedLlmType}
      />
      {/*    for selecting the LLM    */}
      {/* --------------------------- */}
      {selectedLlmType === "Cloud LLM" ? (
        <DropdownMenu
          defaultOption="Llama 3"
          optionList={["Llama 3"]}
          localStorageVariableName="preferred-cloud-model"
        />
      ) : (
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            placeholder="Ollama Model"
            className={styles.inputStyle}
            type="text"
          />
          <button
            className={styles.saveBtn}
            onClick={() => changePreferredModel()}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
