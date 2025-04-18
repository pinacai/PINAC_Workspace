import React from "react";
import { Header } from "../header";
import { LLMSelector } from "./components/LLMSelector";
import { DropdownMenu } from "./components/DropdownMenu";

const Settings: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center scroolbar font-exo">
      <Header title="Settings" page="settings" />
      <div className="w-full h-full mb-5 flex flex-col scroolbar">
        {/*     Section 1 (Select LLM)      */}
        {/* =============================== */}
        <div className="w-full py-5 px-2 flex flex-col items-center">
          <div className="w-full text-lg pb-7 text-gray-200">Select LLM</div>
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
