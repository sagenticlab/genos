// utils/loadSystemConfig.ts
import fs from "fs";
import path from "path";
import { GenosConfig } from "../../models/GenosConfig";

export function loadSystemConfig(workspaceRoot: string, trace = false): GenosConfig | undefined {
  const configPath = path.join(workspaceRoot, "genos.config.json");

  if (!fs.existsSync(configPath)) {
    if (trace) console.error("No GenOS workspace found at", workspaceRoot);
      return;
    }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}