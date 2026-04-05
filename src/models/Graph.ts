import { GraphNode } from "./Nodes";

export interface Edge {
  from: string;
  to: string;
  condition?: {
    input?: string;
    key: string;
  }
}

export interface Graph {
  nodes: {
    [nodeId: string]: GraphNode;
  };

  edges: Edge[];
}