import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, ModuleNode } from "../../../models/Nodes";
import { Project } from "../../../models/Project";
import { findWorkspaceRoot } from "../../utils/findWorkspaceRoot";
import { loadProjectConfig } from "../../utils/loadProjectConfig";
import { runGraph } from "../runtime";

export const moduleNodeHandler = async (node: GraphNode, state: ExecutionState): Promise<ExecutionState> => {
    const moduleNode = node as ModuleNode;
    // Here you would implement the logic to handle the module
    // For now, we will just log the module value
    if(state.trace) {
      console.log(`module Node:`);
      console.log(`Inputs:`, moduleNode.inputs);
      console.log(`Outputs:`, moduleNode.outputs);
    }

    const inputs: Record<string, any> = {};

    for(const [inputKey, stateKey] of Object.entries(moduleNode.inputs)) {
      if(state.data[stateKey] === undefined) {
        throw new Error(`Module input key ${stateKey} not found in state data`);
      }
      inputs[inputKey] = state.data[stateKey];
      if(state.trace) {   
          console.log(`Mapping module input ${inputKey} to state key ${stateKey} with value:`, state.data[stateKey]);
      }
    }
    if(state.trace) {
        console.log(`Executing module: ${moduleNode.module} with inputs:`, inputs);
    }

    const workspaceRoot = findWorkspaceRoot(undefined, state.trace);
    
    if (!workspaceRoot) {
      console.error("Not inside a GenOS workspace. Run 'genos init'.");
      process.exit(1);
    }

    const projectConfig: Project | null = loadProjectConfig(moduleNode.module, state.trace);
    if(projectConfig){

        projectConfig.inputs?.forEach(input => {
            if(inputs[input] === undefined) {
                throw new Error(`Missing required input for module ${moduleNode.module}: ${input}`);
            }
        });

        projectConfig.outputs?.forEach(output => {
            if(!moduleNode.outputs[output]) {
                throw new Error(`Missing required output mapping for module ${moduleNode.module}: ${output}`);
            }
        });

        const initialState: ExecutionState = {
            workspaceRoot: workspaceRoot,
            projectId: projectConfig.id,
            currentNode: projectConfig.entryNode,
            config: state.config,
            data: {...inputs},
            completed: false,
            trace: state.trace ?? false,
        };
        const finalState = await runGraph(projectConfig.graph, projectConfig.entryNode, initialState, projectConfig.resources!);
        for(const [outputKey, stateKey] of Object.entries(moduleNode.outputs)) {
            if(finalState.data[outputKey] === undefined) {
                throw new Error(`Module output key ${outputKey} not found in module execution state data`);
            }
            state.data[stateKey] = finalState.data[outputKey];
        }
    }
        
    state.data['module'] = true;
    return state;
};