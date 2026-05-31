// cli/commands/removeEmbeddingFile.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function removeEmbeddingFile(name: string, fileName: string) {
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
    console.error(`Failed to remove file '${fileName}' from embedding '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ File removed from embedding '${name}'`);
}