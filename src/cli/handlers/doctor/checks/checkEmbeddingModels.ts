import { loadSystemConfig } from "../../../../core/utils/loadSystemConfig";
import { DoctorCheckResult } from "../doctor";

async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkEmbeddingModels(workspace: string): Promise<DoctorCheckResult> {
  const messages: string[] = [];
  let ok = true;

  const config = loadSystemConfig(workspace);
  
  if (!config) {
    return {
      name: "Embedding Models",
      ok: false,
      messages: ["✗ genos.config.json not found"]
    };
  }

  const embeddingModels = config.embeddings || {};

  // Run all model checks in parallel to avoid waiting sequentially for each timeout.
  await Promise.allSettled(
    Object.keys(embeddingModels).map(async (model) => {
      try {
        console.log(`Checking Embedding model: ${model}...`);

        const response = await fetchWithTimeout(embeddingModels[model].endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: embeddingModels[model].model,
            prompt: "ping"
          })
        }, 20000);

        if (response.ok) {
          messages.push(`✓ ${model}:${embeddingModels[model].model} reachable`);
        } else {
          ok = false;
          messages.push(`✗ ${model}:${embeddingModels[model].model} returned error`);
        }

        // Ensure we drain/close the response body so open sockets don't keep Node running.
        try {
          await response.body?.cancel();
        } catch {
          // ignore
        }
      } catch (err) {
        ok = false;
        if (err instanceof Error && err.name === 'AbortError') {
          messages.push(`✗ ${model}:${embeddingModels[model].model} timed out`);
        } else {
          messages.push(`✗ ${model}:${embeddingModels[model].model} unreachable`);
        }
      }
    })
  );

  if (Object.keys(embeddingModels).length === 0) {
    messages.push("⚠ no Embedding Models defined");
  }

  return {
    name: "Embedding Models",
    ok,
    messages
  };
}