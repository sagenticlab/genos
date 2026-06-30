import { ToolDefinition } from "./toolRegistry";

export const BUILTIN_TOOLS: Record<string, ToolDefinition> = {
  "file-reader": {
    type: "fileSystem",
    function: "readFile",
    params: {
      fileName: "{{file_path}}"
    }
  }
};