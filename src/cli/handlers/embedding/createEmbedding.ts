// cli/commands/createEmbedding.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function createEmbedding(name: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  const dir = path.join(workspace, "embeddings", name);

  await fs.mkdir(dir, { recursive: true });

  const file = path.join(dir, `${name}.txt`);

  await fs.writeFile(file, "");

  console.log(`✅ Embedding '${name}' created`);
}