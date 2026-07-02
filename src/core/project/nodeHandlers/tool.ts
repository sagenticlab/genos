import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, ToolNode } from "../../../models/Nodes";
import { CapabilityRegistry } from "../../capability/capabilityRegistry";
import { ToolDefinition } from "../../tools/toolRegistry";

export const toolNodeHandler = async (node: GraphNode, state: ExecutionState, tools: string[], capabilityRegistry: CapabilityRegistry): Promise<ExecutionState> => {
    const toolNode = node as ToolNode;
    // Here you would implement the logic to execute the tool
    // For now, we will just log the tool execution
    if(state.trace) {
      console.log(`Executing tool: ${toolNode.tool}`);
    }

    if(!state.config.tools) {
      throw new Error(`No tools configured in genos.config.json`);
    }

    const tool: string = tools.find(tool => tool === toolNode.tool) as string;
    if (!tool) {
      throw new Error(`Tool not found: ${toolNode.tool}`);
    }

    const toolResource = (state.config.tools as Record<string, ToolDefinition>)[tool];

    if (!toolResource) {
      throw new Error(`Tool resource not found in config: ${toolNode.tool}`);
    }

    const capability = capabilityRegistry.get(toolResource.type);
    if (!capability) {
      throw new Error(`Capability not found for tool type: ${toolResource.type}`);
    }
    
    const resolvedInputs = resolveValue(toolNode.input, state);
    const mergedInputs = toolNode.input ? mergeValues(toolResource.parameters, resolvedInputs) : toolResource.parameters;
    
    if(state.trace) {
      console.log(`Executing tool: ${toolNode.tool} with capability: ${capability.name} and parameters:`, mergedInputs);
    }

    const result = await capability.execute(mergedInputs, state.trace || false);

    state.data[toolNode.output] = JSON.stringify(result); // "Weather is sunny with a high of 25°C.";
    return state;
};

function mergeValues(baseValue: any, overrideValue: any): any {
  if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
    const result: Record<string, any> = { ...baseValue };

    for (const [key, value] of Object.entries(overrideValue)) {
      result[key] = mergeValues(baseValue[key], value);
    }

    return result;
  }

  return overrideValue === undefined ? baseValue : overrideValue;
}

function isPlainObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function resolveValue(value: any, state: ExecutionState): any {

    if (Array.isArray(value)) {
        return value.map(v => resolveValue(v, state));
    }

    if (value !== null && typeof value === "object") {

        const result: any = {};

        for (const [key, child] of Object.entries(value)) {
            result[key] = resolveValue(child, state);
        }

        return result;
    }

    if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
        return getStateValue(state, value.slice(2, -2).trim());
    }

    return value;
}

function getStateValue(state: ExecutionState, key: string): any {
    const split = key.split(".");
    let current: any = state.data;
    for (const part of split) {
        if (!(part in current)) {
            throw new Error(`State variable '${part}' not found`);
        }
        current = current[part];
    }
    return current;
}
