// cli/commands/inspectKnowledge.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function inspectKnowledge(name: string, fileName: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  if (!name) {
    console.error("Knowledge Base name is required to inspect a knowledge base.");
    process.exit(1);
  }

  if (!fileName) {
    console.error("File name is required to inspect a knowledge file.");
    process.exit(1);
  }
  // Inspect the file
  const filePath = path.join(workspace, "knowledge", name, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    console.log(`Content of '${fileName}' in knowledge base '${name}':`);
    console.log(content);
  } catch (error) {
    console.error(`Failed to inspect file '${fileName}' from knowledge base '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ Inspected from knowledge base '${name}'`);
}