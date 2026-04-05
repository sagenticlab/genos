import fs from "fs";
import path from "path";

export async function checkProjects(workspace: string) {
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
    const projectFile = path.join(projectsDir, project, "project.json");

    if (!fs.existsSync(projectFile)) {
      ok = false;
      messages.push(`✗ ${project} missing project.json`);
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(projectFile, "utf8"));

      if (!data.entryNode) {
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