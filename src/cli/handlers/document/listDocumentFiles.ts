// cli/commands/listDocumentFiles.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function listDocumentFiles(name: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  // list the files
  const dir = path.join(workspace, "documents", name);
  try {
    const files = await fs.readdir(dir);
    const txtFiles = files.filter(f => f.endsWith('.txt'));
    if (txtFiles.length === 0) {
      console.log(`No .txt files found in Document '${name}'`);
    } else {
      console.log(`Files in Document '${name}':`);
      txtFiles.forEach(file => console.log(`  - ${file}`));
    }
  } catch (error) {
    console.error(`Failed to list files for Document '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ Files listed from Document '${name}'`);
}