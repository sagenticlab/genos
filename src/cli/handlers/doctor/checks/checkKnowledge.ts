import fs from "fs";
import path from "path";
import { DoctorCheckResult } from "../doctor";

export async function checkKnowledge(workspace: string): Promise<DoctorCheckResult> {
  const messages: string[] = [];
  let ok = true;

  const knowledgeDir = path.join(workspace, "knowledge");
  const vectorsDir = path.join(workspace, ".genos", "vectors");

  if (!fs.existsSync(knowledgeDir)) {
    return {
      name: "Knowledge",
      ok: false,
      messages: ["✗ knowledge folder missing"]
    };
  }

  const knowledge = fs.readdirSync(knowledgeDir);

  if (knowledge.length === 0) {
    messages.push("⚠ no knowledge defined");
  }

  for (const kno of knowledge) {
    const knoFolder = path.join(knowledgeDir, kno);
    const vectorFile = path.join(vectorsDir, `${kno}.json`);

    const files = fs.readdirSync(knoFolder).filter(f => f.endsWith(".txt"));

    if (files.length === 0) {
      messages.push(`⚠ ${kno} has no text files`);
    }

    if (!fs.existsSync(vectorFile)) {
      ok = false;
      messages.push(`✗ ${kno} vectors missing (run: genos knowledge build ${kno})`);
    } else {
      messages.push(`✓ ${kno} vectors built`);
    }
  }

  return {
    name: "Knowledge",
    ok,
    messages
  };
}