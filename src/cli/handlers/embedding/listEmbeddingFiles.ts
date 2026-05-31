// cli/commands/listEmbeddingFiles.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function listEmbeddingFiles(name: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  // list the files
  const dir = path.join(workspace, "knowledge", name);
  try {
    const files = await fs.readdir(dir);
    const txtFiles = files.filter(f => f.endsWith('.txt'));
    if (txtFiles.length === 0) {
      console.log(`No .txt files found in embedding '${name}'`);
    } else {
      console.log(`Files in embedding '${name}':`);
      txtFiles.forEach(file => console.log(`  - ${file}`));
    }
  } catch (error) {
    console.error(`Failed to list files for embedding '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ Files listed from embedding '${name}'`);
}