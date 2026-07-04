import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { confirm } from "@inquirer/prompts";
import fs from "fs/promises";

export async function deleteTool(name: string) {

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

            // ---- Confirm ----
            const ok = await confirm({
                // Print selected settings for confirmation
                message: `Delete tool '${name}'?`,
                default: true
            });

            if (!ok) return;

            delete config.tools[name];

            await fs.writeFile(
                `${workspaceRoot}/genos.config.json`,
                JSON.stringify(config, null, 2)
            );
        }
    

}