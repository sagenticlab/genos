import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

export async function viewTool(name: string) {

    const workspaceRoot = findWorkspaceRoot();

    if (!workspaceRoot) {
        console.error("Not inside a GenOS workspace. Run 'genos init'.");
        process.exit(1);
    }

    const config = loadSystemConfig(workspaceRoot);
    
    if (!config) {
        console.error("No GenOS workspace found.");
        return;
    }

    if (config.tools) {
        const tool = config.tools[name];
        if (!tool) {
            console.error(`Tool '${name}' does not exist in the workspace.`);
            return;
        }
        console.log(`Tool Name: ${name}`);
        console.log(`Tool Type: ${tool.type}`);
        console.log(`Tool Parameters: ${JSON.stringify(tool.parameters, null, 2)}`);
    }
}