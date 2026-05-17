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
  const embeddings = path.join(workspace, "embeddings");
  const genosDir = path.join(workspace, ".genos");
  const vectors = path.join(genosDir, "vectors");

  if (!fs.existsSync(projects)) {
    ok = false;
    messages.push("✗ projects folder missing");
  } else {
    messages.push("✓ projects folder exists");
  }

  if (!fs.existsSync(embeddings)) {
    ok = false;
    messages.push("✗ embeddings folder missing");
  } else {
    messages.push("✓ embeddings folder exists");
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