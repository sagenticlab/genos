import { Command } from "commander";
import { createFunction } from "../handlers/function/createFunction";
import { addToProject } from "../handlers/function/addToProject";

export const functionCommand = new Command("function")
  .description("GenOS Function related commands");

functionCommand
    .command("create <name>")
    .description("Create Function")
    .action(createFunction);

functionCommand
    .command("add <function> <project>")
    .description("Add Function to Project")
    .action(addToProject);