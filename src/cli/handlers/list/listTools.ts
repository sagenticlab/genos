import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

export const listTools = () => {
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

  console.log("\nTools:\n");

  Object.keys(config.tools || {}).forEach((t: any) => console.log(t));
};