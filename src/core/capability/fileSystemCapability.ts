import { Capability } from "./capability";
import fs from 'fs';

export class FileSystemCapability implements Capability {
    name: string;
    description: string;

    constructor() {
        this.name = 'fileSystem';
        this.description = 'Capability to interact with the file system';
    }

    async execute(config: Record<string, any>, trace: boolean): Promise<Record<string, any>> {

        switch (config.function) {
            case "readFile":
              return this.readFile(config.filePath);
            default:
              throw new Error(`Unknown builtin function: ${config.function}`);
          }
    }

    private readFile(filePath: string): { content: string } {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            } 
            return { content: fs.readFileSync(filePath, 'utf-8') };
        } catch (error: any) {
            throw new Error(`Error reading file: ${error.message}`);
        }
    }

}