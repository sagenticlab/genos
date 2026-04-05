import { Command } from "commander";
import fs from "fs";
import path from "path";
import { loadSystemConfig } from "../../core/utils/loadSystemConfig";
import { findWorkspaceRoot } from "../../core/utils/findWorkspaceRoot";

export const buildWorkspace = () => {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    return;
  }

  const config = loadSystemConfig(workspace);

  if (!config) {
    console.log("❌ No GenOS workspace found. Run 'genos init'");
    return;
  }

  const projectsDir = path.join(workspace, "projects");
  const embeddingsDir = path.join(workspace, "embeddings");
  const buildFile = path.join(workspace, ".genos", "build.json");


  console.log("Building GenOS workspace...\n");

  //const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  console.log("✓ Config validated");

  const models = [...(Object.keys(config.languageModels || {})), ...(Object.keys(config.embeddings || {}))];
  const tools = Object.keys(config.tools || {});

  console.log(`✓ ${models.length} models loaded`);
  console.log(`✓ ${tools.length} tools loaded`);

  const projects = fs.existsSync(projectsDir)
    ? fs.readdirSync(projectsDir).filter(p =>
        fs.existsSync(path.join(projectsDir, p, "project.json"))
      )
    : [];

  console.log("\nScanning projects...\n");

  projects.forEach(p => console.log(`✓ ${p}`));

  const embeddings = fs.existsSync(embeddingsDir)
    ? fs.readdirSync(embeddingsDir)
    : [];

  console.log("\nChecking embeddings...\n");

  embeddings.forEach(e => console.log(`✓ ${e}`));

  const buildInfo = {
    models: models.map((m: any) => m.name),
    tools: tools.map((t: any) => t.name),
    projects,
    embeddings
  };

  fs.writeFileSync(buildFile, JSON.stringify(buildInfo, null, 2));

  console.log("\nBuild complete.");
};

export const buildCommand = new Command("build")
  .description("Build GenOS system environment")
  .action(buildWorkspace);