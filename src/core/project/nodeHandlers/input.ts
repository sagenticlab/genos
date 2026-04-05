import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, InputNode } from "../../../models/Nodes";
import readline from "readline";

export const inputNodeHandler = async (node: GraphNode, state: ExecutionState): Promise<ExecutionState> => {
    const inputNode = node as InputNode;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    // Here you would implement the logic to handle the input
    // For now, we will just log the input value
    if(state.trace) {
      console.log(`Input: ${inputNode.mode}`);
    }
    const user_input = await prompt(rl, 'Input: ');
    state.data[inputNode.output] = user_input;
    rl.close();
    return state;
};
function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

