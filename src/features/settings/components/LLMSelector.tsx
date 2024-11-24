import React, { useRef, useEffect, useContext } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { ModelSettingsContext } from "../../../context/ModelSettings";
import styles from "../styles/LLMSelector.module.css";

export const LLMSelector: React.FC = () => {
  const llmContext = useContext(ModelSettingsContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const changePrivateModel = () => {
    const modelName = inputRef.current?.value;
    if (modelName) {
      llmContext?.setOllamaModelName(modelName);
    }
  };

  // Show the preferred ollama model if exist
  useEffect(() => {
    if (llmContext?.textModelType == "Private LLM") {
      const preferredModel = llmContext?.ollamaModelName;
      if (preferredModel && inputRef.current) {
        inputRef.current.value = preferredModel;
      }
    }
  }, [llmContext]);

  //
  // -------------------------------- //
  return (
    <div className={styles.llmSelectionContainer}>
      {/*     Dropdown menu for selecting the LLM type   */}
      {/* ---------------------------------------------- */}
      <DropdownMenu
        defaultOption="Cloud LLM"
        optionList={["Cloud LLM", "Private LLM"]}
        valueName="text-model-type"
      />
      {/*    for selecting the LLM Name    */}
      {/* -------------------------------- */}
      {llmContext?.textModelType == "Cloud LLM" ? (
        <DropdownMenu
          defaultOption="Base Model"
          optionList={["Base Model"]}
          valueName="cloud-model-name"
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
