#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { buildCommand } from "./commands/build";
import { embeddingCommand } from "./commands/embedding";
import { documentCommand } from "./commands/documents";
import { projectCommand } from "./commands/project";
import { listCommand } from "./commands/list";
import { doctorCommand } from "./commands/doctor";


const program = new Command();

program
  .name("genos")
  .description("GenOS - AI runtime environment")
  .version("0.1.0");

// Register commands
program.addCommand(initCommand);
program.addCommand(buildCommand);
program.addCommand(embeddingCommand);
program.addCommand(documentCommand);
program.addCommand(projectCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);

program.parse();