import fs from "fs";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export const listKnowledge = () => {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    return;
  }

  const vectorsDir = path.join(workspace, ".genos", "vectors");
  
    if (!fs.existsSync(vectorsDir)) {
      console.log("No vectors directory.");
      return;
    }

   const vectors = fs.readdirSync(vectorsDir);

  console.log("\nKnowledge:\n");

  vectors.forEach(v => {
    const name = v.replace(".json", "");
    console.log(name)
    });
};