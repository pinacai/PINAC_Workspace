import React from "react";
import { ModelSettingsProvider } from "./ModelSettings";
import { EmbeddingSettingsProvider } from "./EmbeddingSettings";
import { WebSearchProvider } from "./WebSearch";

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ModelSettingsProvider>
      <EmbeddingSettingsProvider>
        <WebSearchProvider>{children}</WebSearchProvider>
      </EmbeddingSettingsProvider>
    </ModelSettingsProvider>
  );
};

export default SettingsProvider;
