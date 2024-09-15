import React, { useRef, useEffect, useContext } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { LLMSettingsContext } from "../../../context/LLMSettings";
import styles from "../styles/LLMSelector.module.css";

export const LLMSelector: React.FC = () => {
  const llmContext = useContext(LLMSettingsContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const changePrivateModel = () => {
    const modelName = inputRef.current?.value;
    if (modelName) {
      llmContext?.setPrivateModel(modelName);
    }
  };

  // Show the preferred ollama model if exist
  useEffect(() => {
    if (llmContext?.modelType == "Private LLM") {
      const preferredModel = llmContext?.privateModel;
      if (preferredModel && inputRef.current) {
        inputRef.current.value = preferredModel;
      }
    }
  }, [llmContext]);

  //
  // -------------------------------- //
  return (
    <div className={styles.llmSelectionContainer}>
      {/* Dropdown menu for selecting the LLM type */}
      {/* ---------------------------------------- */}
      <DropdownMenu
        defaultOption="Cloud LLM"
        optionList={["Cloud LLM", "Private LLM"]}
        taskType="model_type"
      />
      {/*    for selecting the LLM    */}
      {/* --------------------------- */}
      {llmContext?.modelType == "Cloud LLM" ? (
        <DropdownMenu
          defaultOption="Llama 3"
          optionList={["Llama 3"]}
          taskType="cloud_model"
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
            onClick={() => changePrivateModel()}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
