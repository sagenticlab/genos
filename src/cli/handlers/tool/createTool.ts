import { CapabilityRegistry } from "../../../core/capability/capabilityRegistry";
import { HttpCapability } from "../../../core/capability/httpCapability";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import fs from "fs/promises";

export async function createTool(name: string) {

    const capabilityRegistry = new CapabilityRegistry();
    capabilityRegistry.register(new HttpCapability());
    
    const prompts = await import("@inquirer/prompts");
    const { input, confirm, select } = prompts;
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

    if (config.tools && config.tools[name]) {
        console.error(`Tool '${name}' already exists in the workspace.`);
        return;
    }

    // ---- Ask description ----
    const description = await input({
        message: "Tool description:"
    });

    // ---- Ask Type ----
    const type = await select({
        message: "Select tool type:",
        choices: [
            { name: "HTTP", value: "http" },
        ],
        default: "http"
    });

    const schema = capabilityRegistry.get(type)?.getSchema?.();

    if (!schema) {
        console.error(`No schema found for tool type: ${type}`);
        return;
    }

    // ---- Ask for parameters based on schema ----
    const parameters: Record<string, any> = {};

    for (const property of schema.properties) {
        switch (property.type) {
            case "string":
                const inputValue = await input({
                    message: `${property.description} (${property.name}):`,
                    required: property.required || false
                });
                if (inputValue === "" && property.required) {
                    console.error(`Property ${property.name} is required.`);
                    return;
                }
                if (inputValue !== "") {
                    parameters[property.name] = inputValue;
                }
                break;
            case "enum":
                const selectedValue = await select({
                    message: `${property.description} (${property.name}):`,
                    choices: property.values.map((value: string) => ({ name: value, value })),
                    default: property.default
                });
                if (selectedValue === undefined && property.required) {
                    console.error(`Property ${property.name} is required.`);
                    return;
                }
                if (selectedValue !== undefined) {
                    parameters[property.name] = selectedValue;
                }
                break;
            case "map":
                const mapValue = await askKeyValueMap(input, confirm, property);
                if (mapValue === undefined && property.required) {
                    console.error(`Property ${property.name} is required.`);
                    return;
                }
                if (mapValue !== undefined) {
                    parameters[property.name] = mapValue;
                }
                break;
            case "object":
                const objectValue = await askJsonObject(input, confirm, property);
                if (objectValue === undefined && property.required) {
                    console.error(`Property ${property.name} is required.`);
                    return;
                }
                if (objectValue !== undefined) {
                    parameters[property.name] = objectValue;
                }
                break;
            default:
                console.warn(`Unsupported property type: ${property.type}`);
        }
    }

    const toolDefinition = {
        description,
        type,
        parameters
    };

    // ---- Confirm ----
    const ok = await confirm({
        // Print selected settings for confirmation
        message: `Create tool with these settings?\n\n ${name}: ${JSON.stringify(toolDefinition, null, 2)}`,
        default: true
    });

    if (!ok) return;

    console.log(`Tool '${name}' created with toolDefinition:`, toolDefinition);

    // ---- Save to config ----
    if (!config.tools) {
        config.tools = {};
    }
    config.tools[name] = {
        description,
        type,
        parameters
    };

    await fs.writeFile(
        `${workspaceRoot}/genos.config.json`,
        JSON.stringify(config, null, 2)
    );
}

async function askKeyValueMap(input: any, confirm: any, property: any): Promise<Record<string, any> | undefined> {
    
    const shouldAdd = !property.required ? await confirm({
        message: `Do you want to add entries for ${property.description} (${property.name})?`,
        default: false
    }) : true;
    
    if (!shouldAdd) {
        return undefined;
    }
    
    const result: Record<string, any> = {};

    while (true) {
        const key = await input({
            message: `Enter key for ${property.description} (${property.name}) (leave empty to finish):`,
            required: false
        });
        const value = await input({
            message: `Enter value for key '${key}':`,
            required: true
        });
        result[key] = parseValue(value);

        const addMore = await confirm({
            message: "Do you want to add another field?",
            default: false
        });
        if (!addMore) {
            break;
        }
    }

    return result;
}

function parseValue(value: string): any {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
    return value;
}


async function askJsonObject(input: any, confirm: any, property: any): Promise<Record<string, any> | undefined> {

    const shouldAdd = !property.required ? await confirm({
        message: `Do you want to add entries for ${property.description} (${property.name})?`,
        default: false
    }) : true;
    
    if (!shouldAdd) {
        return undefined;
    }
    
    while (true) {
        const jsonString = await input({
            message: `Enter JSON object for ${property.description} (${property.name}):`,
            required: true
        });
        try {
            return JSON.parse(jsonString);
        } catch {
            console.error("Invalid JSON format. Please try again.");
        }
    }
}