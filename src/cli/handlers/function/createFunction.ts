import fs from "fs/promises";
import path from "path";

export async function createFunction(functionName: string) {

    const workspaceRoot = process.cwd();

    const functionsDir = path.join(workspaceRoot, "functions");

    await fs.mkdir(functionsDir, { recursive: true });

    const filePath = path.join(functionsDir, `${functionName}.js`);

    try {
      await fs.access(filePath);
      console.error(`Function '${functionName}' already exists.`);
      process.exit(1);
    } catch {
      // file doesn't exist — continue
    }

    const template = `/**
 * GenOS Function: ${functionName}
 */

export async function ${functionName}(...args) {
  console.log("Function ${functionName} called with:", args);

  // TODO: Implement your logic

  return null;
}
`;

    await fs.writeFile(filePath, template);

    console.log(`✅ Function '${functionName}' added to workspace`);
    return;
}