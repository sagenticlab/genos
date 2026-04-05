// cli/commands/inspectDocument.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function inspectDocument(name: string, fileName: string) {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  if (!name) {
    console.error("Document name is required to inspect an Document.");
    process.exit(1);
  }

  if (!fileName) {
    console.error("File name is required to inspect an Document file.");
    process.exit(1);
  }
  // Inspect the file
  const filePath = path.join(workspace, "documents", name, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    console.log(`Content of '${fileName}' in Document '${name}':`);
    console.log(content);
  } catch (error) {
    console.error(`Failed to inspect file '${fileName}' from Document '${name}': ${error}`);
    process.exit(1);
  }

  console.log(`✅ Inspected from Document '${name}'`);
}