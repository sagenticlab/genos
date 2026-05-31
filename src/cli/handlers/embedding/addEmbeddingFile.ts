// cli/commands/addEmbeddingFile.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function addEmbeddingFile(name: string, fileName: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  const file = path.join(workspace, "knowledge", name, fileName);

  await fs.writeFile(file, "");

  console.log(`✅ File added to embedding '${name}'`);
}