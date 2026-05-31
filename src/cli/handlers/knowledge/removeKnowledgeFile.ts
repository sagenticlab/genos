// cli/commands/removeKnowledgeFile.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function removeKnowledgeFile(name: string, fileName: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  // Remove the file
  const filePath = path.join(workspace, "knowledge", name, fileName);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to remove file '${fileName}' from knowledge base '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ File removed from knowledge base '${name}'`);
}