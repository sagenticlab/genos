// cli/commands/createProject.ts
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function createProject(projectName: string) {
  const prompts = await import("@inquirer/prompts");
  const { input, checkbox, confirm, select } = prompts;
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

  // ---- Ask description ----
  const description = await input({
    message: "Project description:"
  });

  // ---- Ask format ----
  const format = await select({
    message: "Choose project file format:",
    choices: [
      { name: "YAML", value: "yaml" },
      { name: "JSON", value: "json" }
    ],
    default: "yaml"
  });

  // ---- Prepare resource choices ----
  const llmModelChoices = Object.keys(config.languageModels || {});
  const embeddingModelChoices = Object.keys(config.embeddings || {});

  const embeddingVectors = await fs.readdir(path.join(workspaceRoot, ".genos", "vectors"));
  console.log("Found embedding vectors:", embeddingVectors); // remove the file extension for better display
  const embeddingVectorChoices = embeddingVectors.map(f => f.replace(/\.[^/.]+$/, ""));
  

  // ---- Ask selections ----
  const selectedLLMModels = llmModelChoices.length > 0 ? await checkbox({
    message: "Select LLM models:",
    choices: llmModelChoices
  }) : [];

  const selectedEmbeddingModels = embeddingModelChoices.length > 0 ? await checkbox({
    message: "Select embedding models:",
    choices: embeddingModelChoices
  }) : [];

  const selectedEmbeddingVectors = embeddingVectorChoices.length > 0 ? await checkbox({
    message: "Select embedding vectors:",
    choices: embeddingVectorChoices
  }) : [];

  // ---- Confirm ----
  const ok = await confirm({
    message: "Create project with these settings?"
  });

  if (!ok) return;

  // ---- Build project structure ----
  const projectDir = path.join(workspaceRoot, "projects", projectName);

  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, "functions"), { recursive: true });

  // ---- Project package.json ----
  await fs.writeFile(
    path.join(projectDir, "package.json"),
    JSON.stringify(
      {
        name: projectName,
        type: "module",
        private: true
      },
      null,
      2
    )
  );

  const projectJson = {
    id: projectName,
    name: projectName,
    description,
    resources: {
        models: [...selectedLLMModels, ...selectedEmbeddingModels],
        embeddings: [...selectedEmbeddingVectors],
    },
    entryNode: "start",
    graph: { nodes: {}, edges: [] }
  };

  const fileName = `project.${format}`;
  const content = format === 'json' ? JSON.stringify(projectJson, null, 2) : yaml.dump(projectJson, { indent: 2 });

  await fs.writeFile(
    path.join(projectDir, fileName),
    content
  );

  console.log(`✅ Project '${projectName}' created`);
}