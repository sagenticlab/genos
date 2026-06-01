import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, OutputNode } from "../../../models/Nodes";

export const outputNodeHandler = async (node: GraphNode, state: ExecutionState): Promise<ExecutionState> => {
    const outputNode = node as OutputNode;
    // Here you would implement the logic to handle the output
    // For now, we will just log the output value
    if(state.trace) {
      console.log(`Output Node: ${outputNode.input}`);
    }
    console.log(`\n\n===================\n\nOutput: ${state.data[outputNode.input]}\n\n===================\n\n`);

    state.data['output'] = true;
    if(outputNode.output) {
      state.data[outputNode.output] = state.data[outputNode.input];
    }
    return state;``
};