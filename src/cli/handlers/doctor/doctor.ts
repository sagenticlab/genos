import { checkWorkspace } from "./checks/checkWorkspace";
import { checkLanguageModels } from "./checks/checkLanguageModels";
import { checkEmbeddingModels } from "./checks/checkEmbeddingModels";
import { checkEmbeddings } from "./checks/checkEmbeddings";
import { checkProjects } from "./checks/checkProjects";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";
import { checkOllama } from "./checks/checkOllama";

export interface DoctorCheckResult {
  name: string;
  ok: boolean;
  messages: string[];
  fix?: string;
}

export async function doctor() {

  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    process.exit(1);
  }

  console.log("Running GenOS Doctor...\n");
  const checkOllamaResult: DoctorCheckResult[] = await checkOllama();
  const checks: DoctorCheckResult[] = [
    ... checkOllamaResult,
    await checkWorkspace(workspace),
    await checkLanguageModels(workspace),
    await checkEmbeddingModels(workspace),
    await checkEmbeddings(workspace),
    await checkProjects(workspace)
  ];
  
  console.log("\nGenOS Doctor Report");
  console.log("===================\n");

  let systemOk = true;

  for (const check of checks) {
    console.log(check.name);

    for (const msg of check.messages) {
      console.log(" ", msg);
    }

    if (check.fix) {
      console.log(" Fix:", check.fix);
    }

    if (!check.ok) systemOk = false;

    console.log("");
  }

  if (systemOk) {
    console.log("✓ System healthy\n");
  } else {
    console.log("⚠ Issues detected\n");
  }
}