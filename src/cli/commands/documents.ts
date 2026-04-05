import { Command } from "commander";
import { createDocument } from "../handlers/document/createDocument";
import { addDocumentFile } from "../handlers/document/addDocumentFile";
import { removeDocumentFile } from "../handlers/document/removeDocumentFile";
import { listDocumentFiles } from "../handlers/document/listDocumentFiles";
import { inspectDocument } from "../handlers/document/inspectDocument";
import { deleteDocument } from "../handlers/document/deleteDocument";

export const documentCommand = new Command("document")
  .description("GenOS Document related commands");

documentCommand
  .command("create <name>")
  .description("Create Document")
  .action(createDocument);

documentCommand
  .command("add <name> <fileName>")
  .description("Add Document File")
  .action(addDocumentFile);

documentCommand
  .command("remove <name> <fileName>")
  .description("Remove Document File")
  .action(removeDocumentFile);

documentCommand
  .command("list <name>")
  .description("List Document Files")
  .action(listDocumentFiles);

documentCommand
  .command("inspect <name> <fileName>")
  .description("Inspect Document")
  .action(inspectDocument);

documentCommand
  .command("delete <name>")
  .description("Delete Document")
  .action(deleteDocument);