import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function addToProject(functionName: string, projectName: string) {
    console.log("Function name:", functionName);

    const workspace = findWorkspaceRoot();
    
    if (!workspace) {
      console.error("Not inside a GenOS workspace.");
      process.exit(1);
    }

    if(functionName){
        const projectDir = path.join(workspace, 'projects', projectName);
        const projectConfigPath = path.join(projectDir, "project.yaml");
        const projectConfigContent = await fs.readFile(projectConfigPath, "utf-8");
        const projectConfig = yaml.load(projectConfigContent) as any;
        
        if (!projectConfig.resources) {
          projectConfig.resources = {};
        }
        if (!projectConfig.resources.functions) {
          projectConfig.resources.functions = [];
        }
        
        if (!projectConfig.resources.functions.includes(functionName)) {
          projectConfig.resources.functions.push(functionName);
        }
        
        await fs.writeFile(projectConfigPath, yaml.dump(projectConfig, { indent: 2 }));
        console.log(`✅ Embedding '${functionName}' added to project '${projectName}'`);
    }
}