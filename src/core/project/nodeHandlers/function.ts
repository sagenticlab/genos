import { pathToFileURL } from "url";
import path from "path";
import { ExecutionState } from "../../../models/ExecutionState";
import { FunctionNode, GraphNode } from "../../../models/Nodes";
import { FunctionRegistry } from "../../functions/functionRegistry";

export const functionNodeHandler = async (node: GraphNode, state: ExecutionState, functions: string[]): Promise<ExecutionState> => {
    const functionNode = node as FunctionNode;
    // Here you would implement the logic to execute the function
    // For now, we will just log the function name and parameters
    // console.log(`Executing function: ${functionNode.functionName} with input:`, functionNode.input);

    const functionRegistry = new FunctionRegistry();

    const args = functionNode.input.map(inputKey => state.data[inputKey]);
    // console.log(`Function arguments:`, args);
    // Prefer calling builtin functions directly from source (no separate module needed).
    state.data[functionNode.output] = "Function data";
    
    const functionPath = resolveFunctionPath(
      state.workspaceRoot,
      state.projectId,
      functionNode.functionName
    );
    if(!functionPath) {
      throw new Error(`Function path could not be resolved for function: ${functionNode.functionName}`);
    }
    try {
      state.data[functionNode.output] = await runFuncion(functionNode.functionName, args, functionPath, state.trace ?? false);
    } catch (error) {
      if(state.trace) {
        console.log(`Project function not found at ${functionPath}: ${error}`);
      }
      const functionName = functions.find(model => model === functionNode.functionName);
      if (!functionName && !functionRegistry.has(functionNode.functionName)) {
        throw new Error(`function not found in resources: ${functionNode.functionName}`);
      }
      const workspaceFunctionPath = path.join(state.workspaceRoot, 'functions', `${functionNode.functionName}.js`);
      try {
      state.data[functionNode.output] = await runFuncion(functionNode.functionName, args, workspaceFunctionPath, state.trace ?? false);
      } catch (workspaceError) {
        if(state.trace) {
          console.log(`Function not found at ${workspaceFunctionPath}: ${workspaceError}`);
        }
        if (!functionRegistry.has(functionNode.functionName)) {
          throw new Error(`Function not found: ${functionNode.functionName}`);
        }
        const fn = functionRegistry.get(functionNode.functionName);
        if(state.trace) {
          console.log(`Calling builtin function ${functionNode.functionName} with arguments:`, args);
        }
        const result = await fn(...args);
        if(state.trace) {
          console.log(`Builtin function ${functionNode.functionName} returned:`, result);
        }
        state.data[functionNode.output] = result;
      }
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

async function runFuncion(functionName: string, args: any[], functionPath: string, trace: boolean): Promise<void> {
  const module = await import(pathToFileURL(functionPath).href);
  if (module && module[functionName]) {
    const fn = module[functionName];
    if(trace) {
      console.log(`Calling function ${functionName} with arguments:`, args);
    }
    const result = await fn(...args);
    if(trace) {
      console.log(`Function ${functionName} returned:`, result);
    }
    return result;
  }
}