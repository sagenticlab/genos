import { Command } from "commander";
import { createEmbedding } from "../handlers/embedding/createEmbedding";
import { addEmbeddingFile } from "../handlers/embedding/addEmbeddingFile";
import { buildEmbedding } from "../handlers/embedding/buildEmbedding";
import { removeEmbeddingFile } from "../handlers/embedding/removeEmbeddingFile";
import { listEmbeddingFiles } from "../handlers/embedding/listEmbeddingFiles";
import { inspectEmbedding } from "../handlers/embedding/inspectEmbedding";
import { deleteEmbedding } from "../handlers/embedding/deleteEmbedding";

export const embeddingCommand = new Command("embedding")
  .description("[DEPRECATED] Manage knowledge bases");

embeddingCommand
  .command("create <name>")
  .description("[DEPRECATED] Create Knowledge Base")
  .option("-o, --open", "Open the created knowledge base file in the editor")
  .action(
    async (name) => {
      showDeprecationWarning(
        "genos embedding create",
        "genos knowledge create"
      );
      await createEmbedding(name, { open: true });
    }
  );

embeddingCommand
  .command("add <name> <fileName>")
  .description("[DEPRECATED] Add Embedding File")
  .action(
    async (name, fileName) => {
      showDeprecationWarning(
        "genos embedding add",
        "genos knowledge add"
      );
      await addEmbeddingFile(name, fileName);
    }
  );

embeddingCommand
  .command("remove <name> <fileName>")
  .description("[DEPRECATED] Remove Embedding File")
  .action(
    async (name, fileName) => {
      showDeprecationWarning(
        "genos embedding remove",
        "genos knowledge remove"
      );
      await removeEmbeddingFile(name, fileName);
    }
  );

embeddingCommand
  .command("list <name>")
  .description("[DEPRECATED] List Embedding Files")
  .action(
    async (name) => {
      showDeprecationWarning(
        "genos embedding list",
        "genos knowledge list"
      );
      await listEmbeddingFiles(name);
    }
  );

embeddingCommand
  .command("inspect <name> <fileName>")
  .description("[DEPRECATED] Inspect Embedding")
  .action(
    async (name, fileName) => {
      showDeprecationWarning(
        "genos embedding inspect",
        "genos knowledge inspect"
      );
      await inspectEmbedding(name, fileName);
    }
  );

embeddingCommand
  .command("build <name> [model]")
  .description("[DEPRECATED] Build Embedding")
  .action(
    async (name, model) => {
      showDeprecationWarning(
        "genos embedding build",
        "genos knowledge build"
      );
      await buildEmbedding(name, model);
    }
  );

embeddingCommand
  .command("delete <name>")
  .description("[DEPRECATED] Delete Embedding")
  .action(
    async (name) => {
      showDeprecationWarning(
        "genos embedding delete",
        "genos knowledge delete"
      );
      await deleteEmbedding(name);
    }
  );

function showDeprecationWarning(
  oldCommand: string,
  newCommand: string
): void {
  console.warn(`
⚠️  DEPRECATION WARNING

'${oldCommand}' is deprecated and will be removed in a future release.

Please use:

  ${newCommand}

instead.

Continuing execution...
`);
}