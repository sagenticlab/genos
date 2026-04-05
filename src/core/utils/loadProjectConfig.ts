import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { Project } from "../../models/Project";
import { findWorkspaceRoot } from "./findWorkspaceRoot";

export function loadProjectConfig(projectId: string, trace = false): Project | null {
    try {
        const workspace = findWorkspaceRoot();
        if (!workspace) {
            console.error("No GenOS workspace found.");
            return null;
        }

        const projectDir = path.join(workspace, "projects", projectId);
        const yamlPath = path.join(projectDir, "project.yaml");
        const jsonPath = path.join(projectDir, "project.json");

        let configData: string;
        let project: Project;

        if (fs.existsSync(yamlPath)) {
            configData = fs.readFileSync(yamlPath, "utf-8");
            project = yaml.load(configData) as Project;
        } else if (fs.existsSync(jsonPath)) {
            configData = fs.readFileSync(jsonPath, "utf-8");
            project = JSON.parse(configData);
        } else {
            console.error(`No project config found for '${projectId}'. Expected project.yaml or project.json in ${projectDir}`);
            return null;
        }

        if (trace) {
            console.log(`Project config loaded for '${projectId}':`, project);
        }
        return project;
    } catch (err) {
        console.error(`Error loading project config for '${projectId}':`, err);
        return null;
    }
}