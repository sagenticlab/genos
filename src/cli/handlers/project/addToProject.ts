import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

interface AddOptions {
  function?: string;
  embedding?: string;
  tool?: string;
}

export async function addToProject(projectName: string, options: AddOptions) {
  const workspace = findWorkspaceRoot();

  if (!workspace) {
    console.error("Not inside a GenOS workspace.");
    process.exit(1);
  }

  const config = loadSystemConfig(workspace);
    
  if (!config) {
    console.log("No GenOS workspace found.");
    return;
  }

  const projectDir = path.join(workspace, "projects", projectName);

  try {
    await fs.access(projectDir);
  } catch {
    console.error(`Project '${projectName}' does not exist.`);
    process.exit(1);
  }

  // ---- Add Function ----
  if (options.function) {
    const functionName = options.function;

    const functionsDir = path.join(projectDir, "functions");
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

    console.log(`✅ Function '${functionName}' added to project '${projectName}'`);
    return;
  }

  else if(options.embedding) {
    const embeddingName = options.embedding;
    console.log("Embedding name:", embeddingName);
    try {
      const embeddingDir = path.join(workspace, "embeddings", embeddingName);
      const files = await fs.readdir(embeddingDir);
      console.log("Files in embedding directory:", files);
      
      // Load and update the project yaml file
      const projectConfigPath = path.join(projectDir, "project.yaml");
      const projectConfigContent = await fs.readFile(projectConfigPath, "utf-8");
      const projectConfig = yaml.load(projectConfigContent) as any;
      
      if (!projectConfig.resources) {
        projectConfig.resources = {};
      }
      if (!projectConfig.resources.embeddings) {
        projectConfig.resources.embeddings = [];
      }
      
      if (!projectConfig.resources.embeddings.includes(embeddingName)) {
        projectConfig.resources.embeddings.push(embeddingName);
      }
      
      await fs.writeFile(projectConfigPath, yaml.dump(projectConfig, { indent: 2 }));
      console.log(`✅ Embedding '${embeddingName}' added to project '${projectName}'`);
    } catch (error) {
      console.error(`Failed to access embedding directory for '${embeddingName}': ${error}`);
      return
    }
  }

  else if(options.tool) {
    const toolName = options.tool;
    console.log("Tool name:", toolName);

    if(config.tools && toolName){
      console.log('tools',config.tools[toolName]);

      if(config.tools[toolName]){
        // Load and update the project yaml file
        const projectConfigPath = path.join(projectDir, "project.yaml");
        const projectConfigContent = await fs.readFile(projectConfigPath, "utf-8");
        const projectConfig = yaml.load(projectConfigContent) as any;
        
        if (!projectConfig.resources) {
          projectConfig.resources = {};
        }
        if (!projectConfig.resources.tools) {
          projectConfig.resources.tools = [];
        }
        
        if (!projectConfig.resources.tools.includes(toolName)) {
          projectConfig.resources.tools.push(toolName);
        }
        
        await fs.writeFile(projectConfigPath, yaml.dump(projectConfig, { indent: 2 }));
        console.log(`✅ Embedding '${toolName}' added to project '${projectName}'`);
      }
    }
  }

  else {
    console.error("No Options provided. Use --function or --embedding to specify what to add.");
  }
}