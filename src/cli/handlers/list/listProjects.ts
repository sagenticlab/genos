import fs from "fs";
import path from "path";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export const listProjects = () => {
  const workspace = findWorkspaceRoot();
  if (!workspace) {
    console.error("No GenOS workspace found.");
    return;
  }
  const projectsDir = path.join(workspace, "projects");

  if (!fs.existsSync(projectsDir)) {
    console.log("No projects directory.");
    return;
  }

  const projects = fs.readdirSync(projectsDir);

  console.log("\nProjects:\n");

  projects.forEach(p => console.log(p));
};