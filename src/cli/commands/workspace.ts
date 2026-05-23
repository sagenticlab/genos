import { Command } from "commander";
import { createWorkspace } from "../handlers/workspace/createWorkspace";

export const workspaceCommand = new Command("workspace")
  .description("GenOS workspace - Check ollama and guide through workspace if needed")

workspaceCommand
    .command("create <name>")
    .description("Create Workspace")
    .option("-g, --global", "Create workspace in the user home directory")
    .action(createWorkspace);