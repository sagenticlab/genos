import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, ToolNode } from "../../../models/Nodes";
import { interpolateParams } from "../../tools/interpolate";
import { fileReader } from "../../tools/builtin/fileReader";

export const toolNodeHandler = async (node: GraphNode, state: ExecutionState, tools: string[]): Promise<ExecutionState> => {
    const toolNode = node as ToolNode;
    // Here you would implement the logic to execute the tool
    // For now, we will just log the tool execution
    if(state.trace) {
      console.log(`Executing tool: ${toolNode.tool} with parameters:`, toolNode.args);
    }

    if(!state.config.tools) {
      throw new Error(`No tools configured in genos.config.json`);
    }

    const tool: string = tools.find(tool => tool === toolNode.tool) as string;
    if (!tool) {
      throw new Error(`Tool not found: ${toolNode.tool}`);
    }

    const toolResource = (state.config.tools as Record<string, any>)[tool];

    if (!toolResource) {
      throw new Error(`Tool resource not found in config: ${toolNode.tool}`);
    }

    if(!toolNode.args) {
      throw new Error(`Tool node is missing args`);
    }

    if(toolNode.args && !Array.isArray(toolNode.args)) {
      throw new Error(`Tool node args must be an array of state keys or literals`);
    }

    const args: Record<string, any> = {};
    for (const arg of toolNode.args) {
        args[arg] = state.data[arg];
    }

    const params = interpolateParams(toolResource.params, args, state.trace);
    if (toolResource.type === "http") {
      // Here you would implement the logic to make an HTTP request to the tool's endpoint
      // For now, we will just log the HTTP request
      if(state.trace) {
        console.log(`Making HTTP request to ${toolResource.url} with method ${toolResource.method || "GET"} and parameters:`, toolNode.args);
      }
      let url = toolResource.url;

      if (toolResource.method === "GET" && Object.keys(params).length) {
        const qs = buildQueryString(params);
        url = `${url}?${qs}`;
      }

      if(state.trace) {
        console.log(`Final URL: ${url}`);
      }

      const response = await fetch(url, {
        method: toolResource.method || "GET"
      });

      if (!response.ok) {
        throw new Error(`Tool HTTP request failed: ${response.statusText}`);
      }
      const result = await response.json();
      if(state.trace) {
        console.log(`Tool response:`, result);
      }
      state.data[toolNode.output] = JSON.stringify(result);
      return state;
    }
    else if (toolResource.type === "builtin") {
      
      // Here you would implement the logic to execute the function tool
      // For now, we will just log the function execution 

      console.log(`Executing builtin function: ${toolResource.function} with parameters:`, params, args);

      const result = callBuiltinFunction(toolResource.function, params);
      
      if(state.trace) {
        console.log(`Tool response:`, result);
      }
      state.data[toolNode.output] = JSON.stringify(result);
      return state;
    }

    state.data[toolNode.output] = "Weather is sunny with a high of 25°C.";
    return state;
};

function buildQueryString(params: Record<string, any>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    query.append(key, String(value));
  }

  return query.toString();
}

export function callBuiltinFunction(
  functionName: string,
  params: any
) {
  switch (functionName) {
    case "fileReader":
      return fileReader(params.fileName);
    default:
      throw new Error(`Unknown builtin function: ${functionName}`);
  }
}