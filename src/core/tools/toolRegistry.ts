export interface ToolDefinition {
  name: string;
  type: "http";
  url: string;
  method?: "GET" | "POST";
  params?: Record<string, any>;
}

export class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool '${name}' not found`);
    return tool;
  }

  list() {
    return Array.from(this.tools.values());
  }
}