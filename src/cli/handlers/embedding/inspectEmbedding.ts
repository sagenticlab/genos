// cli/commands/inspectEmbedding.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function inspectEmbedding(name: string, fileName: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  if (!name) {
    console.error("Embedding name is required to inspect an embedding.");
    process.exit(1);
  }

  if (!fileName) {
    console.error("File name is required to inspect an embedding file.");
    process.exit(1);
  }
  // Inspect the file
  const filePath = path.join(workspace, "embeddings", name, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    console.log(`Content of '${fileName}' in embedding '${name}':`);
    console.log(content);
  } catch (error) {
    console.error(`Failed to inspect file '${fileName}' from embedding '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ Inspected from embedding '${name}'`);
}