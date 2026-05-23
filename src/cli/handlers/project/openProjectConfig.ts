import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function openProjectConfig(projectName: string) {
    const workspace = findWorkspaceRoot();
    if (!workspace) {
        console.error("Not inside a GenOS workspace. Run 'genos init'.");
        process.exit(1);
    }
    const config = loadSystemConfig(workspace);
    if (!config) {
        console.error("No GenOS workspace found.");
        return;
    }
    const projectDir = path.join(workspace, "projects", projectName);
    const projectConfigPathYaml = path.join(projectDir, "project.yaml");
    const projectConfigPathJson = path.join(projectDir, "project.json");

    let projectConfigPath: string | null = null;

    // Check if project config exists
    try {
        await fs.access(projectConfigPathYaml);
        projectConfigPath = projectConfigPathYaml;
    } catch {
        try {
            await fs.access(projectConfigPathJson);
            projectConfigPath = projectConfigPathJson;
        } catch {
            console.error(`Project configuration for '${projectName}' not found.`);
            process.exit(1);
        }
    }

    // Open the project config file in the default editor
    console.log(`Opening project configuration: ${projectConfigPath}`);
    const { exec } = await import("child_process");
    const platform = process.platform;
    let command: string;
    if (platform === "win32") {
        command = `notepad "${projectConfigPath}"`;
    } else if (platform === "darwin") {
        command = `open "${projectConfigPath}"`;
    } else {
        command = `xdg-open "${projectConfigPath}"`;
    }
    exec(command, (error) => {
        if (error) {
            console.error(`Error opening file: ${error}`);
        }
    });

}