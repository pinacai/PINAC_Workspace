import React, { useState, useEffect, useContext } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { ModelSettingsContext } from "../../../context/ModelSettings";

export const LLMSelector: React.FC = () => {
  const modelContext = useContext(ModelSettingsContext);
  const [ollamaModelList, setOllamaModelList] = useState([]);

  useEffect(() => {
    window.ipcRenderer.send("get-backend-port");
    window.ipcRenderer.once("backend-port", async (_, port) => {
      try {
        const response = await fetch(
          `http://localhost:${port}/api/ollama/models`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const models = await response.json();
        // Remove ":latest" suffix from model names
        const processedModels = models.map((model: string) =>
          model.replace(/:latest$/, "")
        );
        setOllamaModelList(processedModels);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  //
  // -------------------------------- //
  return (
    <div className="w-full flex flex-col gap-4">
      {/*     Dropdown menu for selecting the LLM type   */}
      {/* ---------------------------------------------- */}
      <DropdownMenu
        defaultOption="Pinac Cloud Model"
        optionList={["Pinac Cloud Model", "Ollama Model"]}
        valueName="model-type"
      />
      {/*    for selecting the LLM Name    */}
      {/* -------------------------------- */}
      {modelContext?.modelType == "Pinac Cloud Model" ? (
        <DropdownMenu
          defaultOption="Base Model"
          optionList={["Base Model"]}
          valueName="pinac-cloud-model"
        />
      ) : (
        <DropdownMenu
          defaultOption={null}
          optionList={ollamaModelList}
          valueName="ollama-model"
        />
      )}
    </div>
  );
};
