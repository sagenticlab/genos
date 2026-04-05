import { loadSystemConfig } from "../../../../core/utils/loadSystemConfig";

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

export async function checkLanguageModels(workspace: string) {
  const messages: string[] = [];
  let ok = true;

  const config = loadSystemConfig(workspace);
    
  if (!config) {
    return {
      name: "Language Models",
      ok: false,
      messages: ["✗ genos.config.json not found"]
    };
  }

  const languageModels = config.languageModels || {};

  // Run all model checks in parallel to avoid waiting sequentially for each timeout.
  await Promise.allSettled(
    Object.keys(languageModels).map(async (model) => {
      try {
        console.log(`Checking Language model: ${model}...`);

        const response = await fetchWithTimeout(languageModels[model].endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: languageModels[model].model,
            prompt: "hello"
          })
        }, 20000);

        if (response.ok) {
          messages.push(`✓ ${model}:${languageModels[model].model} reachable`);
        } else {
          ok = false;
          messages.push(`✗ ${model}:${languageModels[model].model} returned error`);
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
          messages.push(`✗ ${model}:${languageModels[model].model} timed out`);
        } else {
          messages.push(`✗ ${model}:${languageModels[model].model} unreachable`);
        }
      }
    })
  );

  if (Object.keys(languageModels).length === 0) {
    messages.push("⚠ no Language Models defined");
  }

  return {
    name: "Language Models",
    ok,
    messages
  };
}