import { CapabilityRegistry } from "../../../core/capability/capabilityRegistry";
import { HttpCapability } from "../../../core/capability/httpCapability";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

export async function validateTool(name: string) {

    const capabilityRegistry = new CapabilityRegistry();
    capabilityRegistry.register(new HttpCapability());
    
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

        const capability = capabilityRegistry.get(tool.type);
        if (!capability) {
            console.error(`Capability not found for tool type: ${tool.type}`);
            return;
        }

        const validationResult = capability.validateParameters?.(tool.parameters);
        if (validationResult && !validationResult.status) {
            console.error(`Invalid parameters for tool: ${name}. ${validationResult.message}`);
            return;
        }
        console.log(`Tool '${name}' is valid.`);
    }

}