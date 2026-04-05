import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

export const listModels = () => {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    return;
  }
  const config = loadSystemConfig(workspace);
  
  if (!config) {
    console.log("No GenOS workspace found.");
    return;
  }

  const languageModels = Object.keys(config.languageModels || {}) || [];
  const embeddings = Object.keys(config.embeddings || {}) || [];
  if (languageModels.length === 0 && embeddings.length === 0) {
      console.log("No models found in config.");
      return;
    }
    
    console.log("\nLLM Models:\n");
  languageModels.forEach((m: any) => console.log(m));
  console.log("\nEmbedding Models:\n");
  embeddings.forEach((e: any) => console.log(e));
};