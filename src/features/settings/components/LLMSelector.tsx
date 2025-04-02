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
  }, [llmContext?.textModelType]);

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
          lg:bg-gray-800 dark:lg:bg-primary-dark lg:border lg:border-gray-600 dark:lg:border-primary-dark
          bg-gray-200 dark:bg-transparent border-1 border-gray-300 dark:border-zinc-600
          "
        >
          <input
            ref={inputRef}
            placeholder="Ollama Model"
            className="w-full h-full p-2 outline-none text-md text-gray-900 lg:text-gray-200 dark:text-gray-200"
            type="text"
          />
          <button
            className="h-full px-2.5 rounded-r-lg hover:bg-gray-300 lg:hover:bg-gray-700 dark:hover:bg-tertiary-dark cursor-pointer"
            onClick={() => changePrivateModel()}
          >
            <BiSolidSave size={20} className="text-yellow-500" />
          </button>
        </div>
      )}
    </div>
  );
};
