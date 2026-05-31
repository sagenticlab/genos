import fs from "fs";
import path from "path";
import { loadSystemConfig } from "../../../../core/utils/loadSystemConfig";
import { DoctorCheckResult } from "../doctor";

export async function checkWorkspace(workspace: string): Promise<DoctorCheckResult> {
  const messages: string[] = [];
  let ok = true;

  const config = loadSystemConfig(workspace);
  
  if (!config) {
    ok = false;
    messages.push("✗ genos.config.json missing (run: genos init)");
  } else {
    messages.push("✓ genos.config.json found");
  }

  const projects = path.join(workspace, "projects");
  const knowledge = path.join(workspace, "knowledge");
  const genosDir = path.join(workspace, ".genos");
  const vectors = path.join(genosDir, "vectors");

  if (!fs.existsSync(projects)) {
    ok = false;
    messages.push("✗ projects folder missing");
  } else {
    messages.push("✓ projects folder exists");
  }

  if (!fs.existsSync(knowledge)) {
    ok = false;
    messages.push("✗ knowledge folder missing");
  } else {
    messages.push("✓ knowledge folder exists");
  }

  if (!fs.existsSync(genosDir)) {
    ok = false;
    messages.push("✗ .genos folder missing");
  } else {
    messages.push("✓ .genos folder exists");
  }

  if (!fs.existsSync(vectors)) {
    ok = false;
    messages.push("✗ .genos/vectors folder missing");
  } else {
    messages.push("✓ vector storage exists");
  }

  return {
    name: "Workspace",
    ok,
    messages
  };
}