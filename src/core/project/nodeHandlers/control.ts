import { ExecutionState } from "../../../models/ExecutionState";
import { ControlNode, GraphNode } from "../../../models/Nodes";

export const controlNodeHandler = async (node: GraphNode, state: ExecutionState): Promise<string|null> => {
    const controlNode = node as ControlNode;
    // Here you would implement the logic to handle control flow
    // For now, we will just log the control node type
    if(state.trace) {
      console.log(`Control Node Type: ${controlNode.type}`);
    }
    if (controlNode.input) {
      const decisionValue = state.data[controlNode.input] === true ? 'true' : 'false';
      if(state.trace) {
        console.log(`Control decision value: ${decisionValue}`);
      }
      const route = controlNode.routes[decisionValue];

      if (route) {
        return route;
      }

    }
    return null;
};