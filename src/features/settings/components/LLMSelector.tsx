import React, { useRef, useEffect, useContext } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { ModelSettingsContext } from "../../../context/ModelSettings";
import { BiSolidSave } from "react-icons/bi";

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
    <div className="w-full flex flex-col gap-4">
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
        <div
          className="max-w-64 h-10 flex justify-between items-center rounded-lg
          bg-gray-800 dark:bg-primary-dark border border-gray-600 dark:border-primary-dark
          "
        >
          <input
            ref={inputRef}
            placeholder="Ollama Model"
            className="w-full h-full p-2 outline-none text-md"
            type="text"
          />
          <button
            className="h-full px-2.5 rounded-r-lg hover:bg-gray-700 dark:hover:bg-primary-dark cursor-pointer"
            onClick={() => changePrivateModel()}
          >
            <BiSolidSave size={20} className="text-yellow-500" />
          </button>
        </div>
      )}
    </div>
  );
};
