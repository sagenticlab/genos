import { Command } from "commander";
import { createTool } from "../handlers/tool/createTool";

export const toolCommand = new Command("tool")
  .description("Tool management commands")

toolCommand
    .command("create <name>")
    .description("Create Tool")
    .action(createTool);