import { GenosConfig } from "./GenosConfig";

export interface ExecutionState {
  workspaceRoot: string; // Root directory of the workspace for resolving relative paths
  /** Data produced by nodes (single source of truth) */
  data: Record<string, any>;

  projectId: string; // Optional project identifier for context

  /** Node execution pointer */
  currentNode: string;

  /** Execution flags */
  completed: boolean;

  trace?: boolean; // Flag to indicate if trace mode is enabled

  config: GenosConfig; // Global configuration loaded from genos.config.json

  // /** Execution metadata */
  // meta: {
  //   stepCount: number;
  //   startTime: number;
  // };

  /** Error information if execution halts */
  error?: {
    message: string;
    node: string;
  };
}