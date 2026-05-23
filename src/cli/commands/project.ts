import { Command } from "commander";
import { createProject } from "../handlers/project/createProject";
import { runProject } from "../handlers/project/runProject";
import { addToProject } from "../handlers/project/addToProject";
import { openProjectConfig } from "../handlers/project/openProjectConfig";
import { validateProject } from "../handlers/project/validateProject";

export const projectCommand = new Command("project")
  .description("GenOS Project related commands");

projectCommand
    .command("create <name>")
    .description("Create Project")
    .action(createProject);

projectCommand
    .command("validate <name>")
    .option("-t, --trace", "Enable trace mode for detailed execution logs")
    .description("Validate Project")
    .action(validateProject);

projectCommand
    .command("run <name>")
    .option("-t, --trace", "Enable trace mode for detailed execution logs")
    .description("Run Project")
    .action(runProject);

projectCommand
  .command("add <project>")
  .option("-f, --function <name>", "Add function to project")
  .option("-e, --embedding <name>", "Add embedding to project")
  .option("-t, --tool <name>", "Add tool to project")
  .description("Add resources to a project")
  .action(addToProject);

projectCommand
    .command("open <name>")
    .description("Open Project Configuration")
    .action(openProjectConfig);