// cli/commands/createEmbedding.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function createEmbedding(name: string, options: { open?: boolean }) {
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

  if (options?.open) {
    console.log(`Opening embedding file...`);

    // Open the file in the default editor
    const { exec } = await import("child_process");
    const platform = process.platform;
    let command: string;

    if (platform === "win32") {
      command = `notepad "${file}"`;
    } else if (platform === "darwin") {
      command = `open "${file}"`;
    } else {
      command = `xdg-open "${file}"`;
    }

    exec(command, (error) => {
      if (error) {
        console.error(`Error opening file: ${error}`);
      }
    });
  } else {
    console.log(`Created embedding file at ${file}`);
  }
}