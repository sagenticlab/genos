import { Command } from "commander";
import { createTool } from "../handlers/tool/createTool";
import { deleteTool } from "../handlers/tool/deleteTool";
import { viewTool } from "../handlers/tool/viewTool";
import { validateTool } from "../handlers/tool/validateTool";
import { testTool } from "../handlers/tool/testTool";

export const toolCommand = new Command("tool")
  .description("Tool management commands")

toolCommand
    .command("create <name>")
    .description("Create Tool")
    .action(createTool);

toolCommand
    .command("view <name>")
    .description("View Tool")
    .action(viewTool);

toolCommand
    .command("validate <name>")
    .description("Validate Tool")
    .action(validateTool);

toolCommand
    .command("test <name>")
    .description("Test Tool")
    .option("-p, --params <json>", "JSON parameters for the tool")
    .action(testTool);

toolCommand
    .command("delete <name>")
    .description("Delete Tool")
    .action(deleteTool);