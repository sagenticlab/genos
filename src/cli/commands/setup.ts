import { Command } from "commander";
import { setup } from "../handlers/setup/setup";

export const setupCommand = new Command("setup")
  .description("GenOS Setup - Check ollama and guide through setup if needed")
  .option("-d, --default", "Use default models (phi3, mxbai-embed-large) without prompting")
  .action(setup);