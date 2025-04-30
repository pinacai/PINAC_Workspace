import React, { useState, useEffect, useContext } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { ModelSettingsContext } from "../../../context/ModelSettings";

export const LLMSelector: React.FC = () => {
  const llmContext = useContext(ModelSettingsContext);
  const [ollamaModelList, setOllamaModelList] = useState([]);

  useEffect(() => {
    window.ipcRenderer.send("get-backend-port");

    window.ipcRenderer.on("backend-port", async (_, res) => {
      try {
        const response = await fetch(
          `http://localhost:${res.port}/api/ollama/models`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const models = await response.json();
        setOllamaModelList(models);
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
        defaultOption="Pinac CLoud Model"
        optionList={["Pinac CLoud Model", "Ollama Model"]}
        valueName="model-type"
      />
      {/*    for selecting the LLM Name    */}
      {/* -------------------------------- */}
      {llmContext?.modelType == "Pinac CLoud Model" ? (
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
