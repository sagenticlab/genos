export interface LLMNode {
  type: "llm";
  model: string; // reference to SystemConfig.languageModels
  systemContext?: string; // state keys for input systemContext
  context?: string;
  input: string[]; // state key
  output: string; // state key
}

export interface RAGNode {
  type: "rag";
  model: string;
  knowledge: string; // reference to EmbeddingAsset
  input: string; // state key
  output: string; // state key
}

export interface ToolNode {
  type: "tool";
  tool: string; // reference to SystemConfig.tools
  input?: string; // state key
  output: string; // state key
}

export interface FunctionNode {
  type: "function";
  builtin?: boolean;
  runtime: "python" | "typescript";
  functionName: string;
  input: string[];
  output: string;
}

export interface ControlNode {
  type: "control";
  mode: "loop" | "branch";
  input?: string;
  routes: {
    true: string;
    false?: string;
  };
}

export interface InputNode {
  type: "input";
  mode: "cli" | "api" | "gui";
  output: string; // state key
}

export interface OutputNode {
  type: "output";
  mode: "cli" | "api";
  input: string;
  output?: string; // state key or literal value
}

export interface ModuleNode {
  type: "module";
  module: string; // reference to another Project
  inputs: { [key: string]: string }; // mapping of module input keys to state keys
  outputs: { [key: string]: string }; // mapping of module output keys to state keys
}


export interface AgentNode {
  type: "agent";
  input: string;
}



export type GraphNode = LLMNode | RAGNode | ToolNode | FunctionNode | ControlNode | InputNode | OutputNode | ModuleNode | AgentNode;

