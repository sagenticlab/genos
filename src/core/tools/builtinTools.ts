import { ToolDefinition } from "./toolRegistry";

export const BUILTIN_TOOLS: Record<string, ToolDefinition> = {
  "file-reader": {
    type: "fileSystem",
    description: "Read the content of a file from the file system",
    parameters: {
        function: "readFile",
        filePath: "{{file_path}}"
    }
  }
};