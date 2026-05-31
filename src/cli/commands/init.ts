import { Command } from "commander";

import fs from "fs";
import path from "path";
import { GenosConfig } from "../../models/GenosConfig";
import { findWorkspaceRoot } from "../../core/utils/findWorkspaceRoot";

const initWorkspace = () => {
  let workspace = findWorkspaceRoot();
  if (!workspace) {
    workspace = process.cwd();
    // console.error("No GenOS workspace found.");
    // return;
  }

  const genosDir = path.join(workspace, ".genos");
  const configPath = path.join(workspace, "genos.config.json");
  const vectorsDir = path.join(genosDir, "vectors");
  const knowledgePath = path.join(workspace, "knowledge");
  const functionsPath = path.join(workspace, "functions");
  // const documentsPath = path.join(workspace, "documents");
  const projectsPath = path.join(workspace, "projects");

  if (fs.existsSync(configPath)) {
    console.log("⚠ GenOS workspace already initialized.");
    return;
  }

  console.log("Initializing GenOS workspace...\n");

  const defaultConfig: GenosConfig = {
    version: "1.0",
    languageModels: {},
    embeddingModels: {},
    tools: {}
  };

  fs.mkdirSync(genosDir, { recursive: true });

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));

  fs.mkdirSync(knowledgePath, { recursive: true });
  // fs.mkdirSync(documentsPath, { recursive: true });
  fs.mkdirSync(projectsPath, { recursive: true });
  fs.mkdirSync(vectorsDir, { recursive: true });
  fs.mkdirSync(functionsPath, { recursive: true });

  console.log("✓ Created genos.config.json");
  console.log("✓ Created knowledge/");
  console.log("✓ Created documents/");
  console.log("✓ Created projects/");
  console.log("✓ Created functions/");
  console.log("✓ Created .genos/vectors");

  console.log("\nWorkspace ready.");
};

export const initCommand = new Command("init")
  .description("Initialize GenOS workspace")
  .action(initWorkspace);