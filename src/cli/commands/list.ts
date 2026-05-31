import { Command } from "commander";
import { listProjects } from "../handlers/list/listProjects";
import { listEmbeddings } from "../handlers/list/listEmbeddings";
import { listModels } from "../handlers/list/listModels";
import { listTools } from "../handlers/list/listTools";
import { listKnowledge } from "../handlers/list/listKnowledge";

export const listCommand = new Command("list")
  .description("List GenOS workspace")

listCommand
    .command("projects")
    .description("List projects")
    .action(listProjects);

listCommand
    .command("embeddings")
    .description("List embeddings")
    .action(listEmbeddings);

listCommand
    .command("knowledge")
    .description("List knowledge")
    .action(listKnowledge);

listCommand
    .command("models")
    .description("List models")
    .action(listModels);

listCommand
    .command("tools")
    .description("List tools")
    .action(listTools);