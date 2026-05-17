import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { DoctorCheckResult } from "../doctor";

export async function checkProjects(workspace: string): Promise<DoctorCheckResult> {
  const messages: string[] = [];
  let ok = true;

  const projectsDir = path.join(workspace, "projects");

  if (!fs.existsSync(projectsDir)) {
    return {
      name: "Projects",
      ok: false,
      messages: ["✗ projects folder missing"]
    };
  }

  const projects = fs.readdirSync(projectsDir);

  if (projects.length === 0) {
    messages.push("⚠ no projects found");
  }

  for (const project of projects) {
    const projectJSONFile = path.join(projectsDir, project, "project.json");
    const projectYAMLFile = path.join(projectsDir, project, "project.yaml");
    if (!fs.existsSync(projectJSONFile) && !fs.existsSync(projectYAMLFile)) {
      ok = false;
      messages.push(`✗ ${project} missing project config (project.json or project.yaml)`);
      continue;
    }

    try {
      const data = fs.existsSync(projectJSONFile)
        ? JSON.parse(fs.readFileSync(projectJSONFile, "utf8"))
        : yaml.load(fs.readFileSync(projectYAMLFile, "utf8"));

      if (!data?.entryNode) {
        ok = false;
        messages.push(`✗ ${project} missing entryNode`);
      } else {
        messages.push(`✓ ${project} valid`);
      }

    } catch (err) {
      ok = false;
      messages.push(`✗ ${project} invalid JSON`);
    }
  }

  return {
    name: "Projects",
    ok,
    messages
  };
}