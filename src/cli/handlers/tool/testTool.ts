import { CapabilityRegistry } from "../../../core/capability/capabilityRegistry";
import { HttpCapability } from "../../../core/capability/httpCapability";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";

export async function testTool(name: string, options: any) {

    const parametersString = options.params;

    if (!parametersString) {
        console.error("Parameters are required. Please provide JSON parameters using the --params flag.");
        console.error("Example: genos tool test weather-data2 --params '{\"url\":\"https://...\",\"method\":\"GET\",\"query\":{...}}'");
        return;
    }

    let parameters: Record<string, any>;
    try {
        parameters = JSON.parse(parametersString);
    } catch (error: any) {
        console.error("Invalid JSON format for parameters.");
        console.error(`Received: ${parametersString}`);
        console.error(`Error: ${error.message}`);
        console.error("\nUsage: genos tool test <name> --params '<valid-json-parameters>'");
        console.error("Example: genos tool test weather-data2 --params '{\"url\":\"https://api.open-meteo.com/v1/forecast\",\"method\":\"GET\",\"query\":{\"current_weather\":true,\"latitude\":12.97,\"longitude\":77.59}}'");
        return;
    }

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

        const validationResult = capability.validateParameters?.(parameters);
        if (validationResult && !validationResult.status) {
            console.error(`Invalid parameters for tool: ${name}. ${validationResult.message}`);
            return;
        }

        try {
            const result = await capability.execute(parameters, true);
            console.log(`Tool '${name}' executed successfully. Result: ${JSON.stringify(result, null, 2)}`);
        } catch (error: any) {
            console.error(`Error executing tool '${name}': ${error.message}`);
        }

    }
}