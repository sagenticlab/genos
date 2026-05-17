import { execSync } from "child_process";
import { DoctorCheckResult } from "../doctor";

export async function checkOllama(): Promise<DoctorCheckResult[]> {
  const results: DoctorCheckResult[] = [];

  /**
   * 1️⃣ Check if Ollama CLI exists
   */
  try {
    execSync("ollama --version", {
      stdio: "ignore"
    });

    results.push({
      name: "Ollama",
      ok: true,
      messages: ["Ollama is installed"]
    });
  } catch {
    results.push({
      name: "Ollama",
      ok: false,
      messages: ["Ollama is not installed"],
      fix: "Install Ollama from https://ollama.com/download"
    });

    // no point continuing further
    return results;
  }

  /**
   * 2️⃣ Check if Ollama server is running
   */
  try {
    const response = await fetch("http://localhost:11434/api/tags");

    if (!response.ok) {
      throw new Error("Ollama server unreachable");
    }

    results.push({
      name: "Ollama",
      ok: true,
      messages: ["Ollama server is running"]
    });
  } catch {
    results.push({
      name: "Ollama",
      ok: false,
      messages: ["Ollama server is not running"],
      fix: "Start Ollama or run: ollama serve"
    });

    // no point checking models
    return results;
  }

  return results;
}