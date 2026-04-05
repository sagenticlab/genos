import { pathToFileURL } from "url";
import path from "path";
import { ExecutionState } from "../../../models/ExecutionState";
import { FunctionNode, GraphNode } from "../../../models/Nodes";

export const functionNodeHandler = async (node: GraphNode, state: ExecutionState): Promise<ExecutionState> => {
    const functionNode = node as FunctionNode;
    // Here you would implement the logic to execute the function
    // For now, we will just log the function name and parameters
    // console.log(`Executing function: ${functionNode.functionName} with input:`, functionNode.input);
    const args = functionNode.input.map(inputKey => state.data[inputKey]);
    // console.log(`Function arguments:`, args);
    state.data[functionNode.output] = "Function data";
    const functionPath = resolveFunctionPath(
        state.workspaceRoot,
        state.projectId,
        functionNode.functionName
    );
    //const module = await import(`../../functions/${functionNode.functionName}.js`);
    const module = await import(pathToFileURL(functionPath).href);
    // console.log(`Module loaded for function ${functionNode.functionName}:`, module);
    if (module && module[functionNode.functionName]) {
        const fn = module[functionNode.functionName];
        if(state.trace) {
          console.log(`Calling function ${functionNode.functionName} with arguments:`, args);
          console.log(`Function ${functionNode.functionName} returned:`, fn(...args));
        }
        const result = await fn(...args);
        state.data[functionNode.output] = result;
    }
    return state;
};

export function resolveFunctionPath(
  workspaceRoot: string,
  projectId: string,
  functionName: string
) {
  return path.join(
    workspaceRoot,
    "projects",
    projectId,
    "functions",
    `${functionName}.js`
  );
}