import { ExecutionState } from "../../models/ExecutionState";
import { Edge, Graph } from "../../models/Graph";
import { GraphNode } from "../../models/Nodes";
import { Resources } from "../../models/Resources";
import { controlNodeHandler } from "./nodeHandlers/control";
import { functionNodeHandler } from "./nodeHandlers/function";
import { inputNodeHandler } from "./nodeHandlers/input";
import { llmNodeHandler } from "./nodeHandlers/llm";
import { outputNodeHandler } from "./nodeHandlers/output";
import { ragNodeHandler } from "./nodeHandlers/rag";
import { toolNodeHandler } from "./nodeHandlers/tool";
import { moduleNodeHandler } from "./nodeHandlers/module";
import { BUILTIN_TOOLS } from "../tools/toolRegistry";

export const runGraph = async (
  graph: Graph,
  entryNode: string,
  initialState: ExecutionState,
  resources: Resources,
): Promise<ExecutionState> => {

  // Injecting Builtin tools.
  initialState.config.tools = { ...BUILTIN_TOOLS, ...initialState.config.tools };

  const state: ExecutionState = {
    ...initialState,
    currentNode: entryNode,
    completed: false
  };

  const models = resources?.models || [];
  const knowledge = resources?.knowledge || [];
  const tools = resources?.tools || [];
  const functions = resources?.functions || [];

  tools.push(...Object.keys(BUILTIN_TOOLS));

  while (!state.completed) {
    if (state.currentNode === "__end__") {
        state.completed = true;
        break;
    }
    const node = graph.nodes[state.currentNode];
    if (!node) {
      throw new Error(`Node not found: ${state.currentNode}`);
    }

    let nextNode: string | null = null;

    // 1️⃣ Execute node
    switch (node.type) {
      case "input":
        await inputNodeHandler(node, state);
        break;
      case "llm":
        await llmNodeHandler(node, state, models);
        break;
      case "rag":
        await ragNodeHandler(node, state, models, knowledge);
        break;
      case "output":
        await outputNodeHandler(node, state);
        break;
      case "function":
        await functionNodeHandler(node, state, functions);
        break;
      case "tool":
        await toolNodeHandler(node, state, tools);
        break;
      case "module":
        await moduleNodeHandler(node, state);
        break;
      case "control":
        nextNode = await controlNodeHandler(node, state);
        break;
      default:
        throw new Error(`Unsupported node type: ${(node as GraphNode).type}`);
    }

    if (!nextNode) {
      const outgoing = graph.edges.filter(e => e.from === state.currentNode);

      if (outgoing.length === 0) {
        throw new Error(`Invalid graph: node '${state.currentNode}' has no outgoing edges`);
      } else if (outgoing.length === 1) {
        nextNode = outgoing[0].to;
      } else if (outgoing.length === 2) {
        const decisionValue = getDecisionValue(outgoing[0], outgoing[1], state);
        if(state.trace) {
          console.log("Outgoing edges:", outgoing);
          console.log(`Decision value for node '${state.currentNode}':`, decisionValue);
        }
        if (decisionValue === 'always') {
          throw new Error(`Invalid graph: node '${state.currentNode}' has 2 outgoing edges but no valid condition`);
        } else {
          nextNode = outgoing.find(e => e.condition?.key === decisionValue)?.to || null;
        }
      } else if (outgoing.length > 2) {
        throw new Error(`Invalid graph: node '${state.currentNode}' has more than 2 outgoing edges`);
      }
    }

    else {
      // 3️⃣ Validate edge
      const edgeExists = graph.edges.some(
        e => e.from === state.currentNode && e.to === nextNode
      );
      console.log("Invalid edge:", graph.nodes[state.currentNode]);
      if (!edgeExists) {
        const currentNodeObj = graph.nodes[state.currentNode];
        if(currentNodeObj.type != "control" || nextNode != '__end__') {
          throw new Error(
            `Invalid transition from '${state.currentNode}' to '${nextNode}'`
          );
        }
      }
    }

    if(!nextNode) {
      throw new Error(
        `Invalid next node for node '${state.currentNode}'`
      );
    }

    state.currentNode = nextNode;
  }

  return state;
};

const getDecisionValue = (edgeA: Edge, edgeB: Edge, state: ExecutionState) => {
  let input: string | undefined;
  if (!edgeA.condition || !edgeA.condition.input || !edgeB.condition || !edgeB.condition.input) {
    return 'always';
  }

  input = edgeA.condition.input;
  if (edgeB.condition.input === input) {
    return state.data[input];
  }
  return 'always';
}