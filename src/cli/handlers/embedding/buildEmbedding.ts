// cli/commands/buildEmbedding.ts
import fs from "fs/promises";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { RetrivalAugmentedGeneration } from "../../../core/rag/storage";
import { Chunk } from "../../../models/Chunk";

export async function buildEmbedding(name: string, model: string) {

  const workspaceRoot = findWorkspaceRoot();
  if (!workspaceRoot) {
    console.error("Not inside a GenOS workspace. Run 'genos init'.");
    process.exit(1);
  }
  const config = await loadSystemConfig(workspaceRoot);

  if (!config) {
    console.error("No GenOS workspace found.");
    return;
  }

  // if model name is not provided, ask user to select from configured embedding models
  if (!model) {
    const embeddingModelChoices = Object.keys(config.embeddings || {});
    console.log("Available embedding models:", embeddingModelChoices);
    const prompts = await import("@inquirer/prompts");
    const { select } = prompts;

    model = await select({
      message: "Select an embedding model",
      choices: embeddingModelChoices.map((m) => ({
        name: m,
        value: m
      }))
    });
  }

  const modelConfig = config.embeddings ? config.embeddings[model] : undefined;
  if (!modelConfig) {
    console.error(`Embedding model '${model}' not found in config.`);
    process.exit(1);
  }

  const rag = new RetrivalAugmentedGeneration(name, modelConfig.model, modelConfig.endpoint);
  
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  const dir = path.join(workspace, "embeddings", name);
  const files = await fs.readdir(dir);

  const texts: string[] = [];

  for (const f of files) {
    if (!f.endsWith(".txt")) continue;

    const content = await fs.readFile(path.join(dir, f), "utf-8");
    texts.push(content);
  }

  const allChunks: Chunk[] = [];

  for (const f of files) {
    if (!f.endsWith(".txt")) continue;

    const content = await fs.readFile(path.join(dir, f), "utf-8");

    const chunks = rag.chunkText(content, f, 1000, 200, f);

    allChunks.push(...chunks);
  }

  // TODO: call embedding model
  const chunks: Chunk[] = await Promise.all(allChunks.map(async (c) => {
    const embedding = await rag.embed(c.text);
    c.embedding = embedding;
    return c;
  }));

  const out = path.join(workspace, ".genos", "vectors");
  await fs.mkdir(out, { recursive: true });

  await fs.writeFile(
    path.join(out, `${name}.json`),
    JSON.stringify({ embedding: name, model, chunks: chunks }, null, 2)
  );

  console.log(`✅ Embedding '${name}' built with model '${model}'`);
}