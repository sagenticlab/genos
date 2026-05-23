import { Command } from "commander";
import { createEmbedding } from "../handlers/embedding/createEmbedding";
import { addEmbeddingFile } from "../handlers/embedding/addEmbeddingFile";
import { buildEmbedding } from "../handlers/embedding/buildEmbedding";
import { removeEmbeddingFile } from "../handlers/embedding/removeEmbeddingFile";
import { listEmbeddingFiles } from "../handlers/embedding/listEmbeddingFiles";
import { inspectEmbedding } from "../handlers/embedding/inspectEmbedding";
import { deleteEmbedding } from "../handlers/embedding/deleteEmbedding";

export const embeddingCommand = new Command("embedding")
  .description("GenOS Embedding related commands");

embeddingCommand
  .command("create <name>")
  .description("Create Embedding")
  .option("-o, --open", "Open the created embedding file in the editor")
  .action(createEmbedding);

embeddingCommand
  .command("add <name> <fileName>")
  .description("Add Embedding File")
  .action(addEmbeddingFile);

embeddingCommand
  .command("remove <name> <fileName>")
  .description("Remove Embedding File")
  .action(removeEmbeddingFile);

embeddingCommand
  .command("list <name>")
  .description("List Embedding Files")
  .action(listEmbeddingFiles);

embeddingCommand
  .command("inspect <name> <fileName>")
  .description("Inspect Embedding")
  .action(inspectEmbedding);

embeddingCommand
  .command("build <name> [model]")
  .description("Build Embedding")
  .action(buildEmbedding);

embeddingCommand
  .command("delete <name>")
  .description("Delete Embedding")
  .action(deleteEmbedding);