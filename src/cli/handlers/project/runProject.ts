import { ExecutionState } from "../../../models/ExecutionState";
import { Project } from "../../../models/Project";
import { runGraph } from "../../../core/project/runtime";
import { loadProjectConfig } from "../../../core/utils/loadProjectConfig";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { validateGraph } from "../../../core/project/validateGraph";
import fs from "fs/promises";
import path from "path";

interface RunOptions {
  trace?: boolean;
}

export async function runProject(projectName: string, options: RunOptions) {
    console.log(`🟢 Running project '${projectName}'`);
    const workspaceRoot = findWorkspaceRoot(undefined, options.trace);

    if (!workspaceRoot) {
      console.error("Not inside a GenOS workspace. Run 'genos init'.");
      process.exit(1);
    }

    if (options.trace) {
      console.log(options.trace);
      console.log("Trace mode enabled: Detailed execution logs will be shown.");
    }

    const config = await loadSystemConfig(workspaceRoot, options.trace);
    if (config) {
      if(options.trace) {
        console.log("Config loaded:", config);
      }
      const projectConfig: Project | null = loadProjectConfig(projectName, options.trace);
      if(projectConfig){
        validateGraph(projectConfig.graph);
        
        
        const initialState: ExecutionState = {
          workspaceRoot: workspaceRoot,
          projectId: projectConfig.id,
          currentNode: projectConfig.entryNode,
          config: config,
          data: {},
          completed: false,
          trace: options.trace ?? false,
        };
        runGraph(projectConfig.graph, projectConfig.entryNode, initialState, projectConfig.resources!);
      }
    }
  }