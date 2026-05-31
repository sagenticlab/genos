import { Command } from "commander";
import { createKnowledge } from "../handlers/knowledge/createKnowledge";
import { addKnowledgeFile } from "../handlers/knowledge/addKnowledgeFile";
import { buildKnowledge } from "../handlers/knowledge/buildKnowledge";
import { removeKnowledgeFile } from "../handlers/knowledge/removeKnowledgeFile";
import { listKnowledgeFiles } from "../handlers/knowledge/listKnowledgeFiles";
import { inspectKnowledge } from "../handlers/knowledge/inspectKnowledge";
import { deleteKnowledge } from "../handlers/knowledge/deleteKnowledge";

export const knowledgeCommand = new Command("knowledge")
  .description("GenOS Knowledge related commands");

knowledgeCommand
  .command("create <name>")
  .description("Create Knowledge Base")
  .option("-o, --open", "Open the created knowledge base file in the editor")
  .action(createKnowledge);

knowledgeCommand
  .command("add <name> <fileName>")
  .description("Add Knowledge Base File")
  .action(addKnowledgeFile);

knowledgeCommand
  .command("remove <name> <fileName>")
  .description("Remove Knowledge Base File")
  .action(removeKnowledgeFile);

knowledgeCommand
  .command("list <name>")
  .description("List Knowledge Base Files")
  .action(listKnowledgeFiles);

knowledgeCommand
  .command("inspect <name> <fileName>")
  .description("Inspect Knowledge Base")
  .action(inspectKnowledge);

knowledgeCommand
  .command("build <name> [model]")
  .description("Build Knowledge Base")
  .action(buildKnowledge);

knowledgeCommand
  .command("delete <name>")
  .description("Delete Knowledge Base")
  .action(deleteKnowledge);