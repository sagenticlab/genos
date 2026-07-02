#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { buildCommand } from "./commands/build";
import { embeddingCommand } from "./commands/embedding";
import { documentCommand } from "./commands/documents";
import { projectCommand } from "./commands/project";
import { listCommand } from "./commands/list";
import { doctorCommand } from "./commands/doctor";
import { setupCommand } from "./commands/setup";
import { workspaceCommand } from "./commands/workspace";
import { functionCommand } from "./commands/functions";
import { knowledgeCommand } from "./commands/knowledge";
import { toolCommand } from "./commands/tool";


const program = new Command();

program
  .name("genos")
  .description("GenOS - AI runtime environment")
  .version("0.3.2");

// Register commands
program.addCommand(initCommand);
program.addCommand(workspaceCommand);
program.addCommand(setupCommand);
program.addCommand(buildCommand);
program.addCommand(knowledgeCommand);
program.addCommand(embeddingCommand);
program.addCommand(documentCommand);
program.addCommand(projectCommand);
program.addCommand(functionCommand);
program.addCommand(toolCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);

program.parse();