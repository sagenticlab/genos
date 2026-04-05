import { Project } from "../../../models/Project";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { loadProjectConfig } from "../../../core/utils/loadProjectConfig";
import { validateGraph } from "../../../core/project/validateGraph";

export async function validateProject(projectName: string, options: { trace?: boolean }) {
    console.log(`🟢 Validating project '${projectName}'`);
    const workspaceRoot = findWorkspaceRoot(undefined, options.trace);

    if (!workspaceRoot) {
      console.error("Not inside a GenOS workspace. Run 'genos init'.");
      process.exit(1);
    }

    const config = await loadSystemConfig(workspaceRoot, options.trace);
    if (config) {
      // console.log("Config loaded:", config);
      const projectConfig: Project | null = loadProjectConfig(projectName);
      console.log("Project config loaded:", projectConfig);
      if(projectConfig){
        validateGraph(projectConfig.graph);
      }
    }
  }