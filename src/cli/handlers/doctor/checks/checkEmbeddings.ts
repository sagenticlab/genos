import fs from "fs";
import path from "path";

export async function checkEmbeddings(workspace: string) {
  const messages: string[] = [];
  let ok = true;

  const embeddingsDir = path.join(workspace, "embeddings");
  const vectorsDir = path.join(workspace, ".genos", "vectors");

  if (!fs.existsSync(embeddingsDir)) {
    return {
      name: "Embeddings",
      ok: false,
      messages: ["✗ embeddings folder missing"]
    };
  }

  const embeddings = fs.readdirSync(embeddingsDir);

  if (embeddings.length === 0) {
    messages.push("⚠ no embeddings defined");
  }

  for (const emb of embeddings) {
    const embFolder = path.join(embeddingsDir, emb);
    const vectorFile = path.join(vectorsDir, `${emb}.json`);

    const files = fs.readdirSync(embFolder).filter(f => f.endsWith(".txt"));

    if (files.length === 0) {
      messages.push(`⚠ ${emb} has no text files`);
    }

    if (!fs.existsSync(vectorFile)) {
      ok = false;
      messages.push(`✗ ${emb} vectors missing (run: genos embedding build ${emb})`);
    } else {
      messages.push(`✓ ${emb} vectors built`);
    }
  }

  return {
    name: "Embeddings",
    ok,
    messages
  };
}