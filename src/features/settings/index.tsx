import React, { useContext } from "react";
import { Header } from "../header";
import { LLMSelector } from "./components/LLMSelector";
import { DropdownMenu } from "./components/DropdownMenu";
import { ModelSettingsContext } from "../../context/ModelSettings";

const Settings: React.FC = () => {
  const modelContext = useContext(ModelSettingsContext);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center scroolbar font-exo">
      <Header title="Settings" page="settings" />
      <div className="w-full h-full mb-5 flex flex-col scroolbar">
        {/*     Section 1 (Select LLM)      */}
        {/* =============================== */}
        <div className="w-full py-5 px-2 flex flex-col items-center">
          {/*     Warning card     */}
          {modelContext?.textModelType === "Private LLM" && (
            <div className="w-full mb-5 p-3 bg-blue-500/5 rounded-2xl overflow-hidden border-l-4 border-blue-600">
              <div className="px-2 flex flex-col justify-center items-start">
                <h3 className="text-lg font-bold text-blue-600">NOTE!</h3>
                <div className="mt-1 text-sm text-gray-400">
                  Write the exact name of model as in Ollama.
                </div>
              </div>
            </div>
          )}
          {/* ------------------ */}
          <div className="w-full text-lg pb-7 text-gray-200">
            Select LLM
          </div>
          <LLMSelector />
        </div>
        {/*   Section 2 (Output Language)    */}
        {/* ================================= */}
        <div className="w-full py-5 px-2 flex flex-col items-center">
          <div className="w-full text-lg pb-7 text-gray-200">
            Output Language
          </div>
          <DropdownMenu
            defaultOption="English"
            optionList={["English"]}
            valueName="output-language"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
