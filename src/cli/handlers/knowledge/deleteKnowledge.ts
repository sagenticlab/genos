// cli/commands/deleteKnowledge.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function deleteKnowledge(name: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  // Delete the knowledge directory
  const knowledgeDir = path.join(workspace, "knowledge", name);
  try {
    await fs.rm(knowledgeDir, { recursive: true, force: true });
  } catch (error) {
    console.error(`Failed to delete knowledge directory: ${error}`);
    process.exit(1);
  }

  // Delete the vector file if it exists
  const vectorFile = path.join(workspace, ".genos", "vectors", `${name}.json`);
  try {
    await fs.unlink(vectorFile);
  } catch (error) {
    // Ignore if file doesn't exist
  }

  console.log(`✅ Knowledge Base deleted: '${name}'`);
}