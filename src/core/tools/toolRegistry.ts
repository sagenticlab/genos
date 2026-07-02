import { BUILTIN_TOOLS } from "./builtinTools";

export interface ToolDefinition {
  type: "http" | "fileSystem";
  description: string;
  parameters: Record<string, any>;
}

export class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  constructor() {
    Object.entries(BUILTIN_TOOLS).forEach(([name, tool]) => this.register(name, tool));
  }

  register(name: string, tool: ToolDefinition) {
    this.tools.set(name, tool);
  }

  get(name: string): ToolDefinition {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool '${name}' not found`);
    return tool;
  }

  list() {
    return Array.from(this.tools.keys());
  }
}