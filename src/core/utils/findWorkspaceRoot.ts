// utils/findWorkspaceRoot.ts
import fs from "fs";
import path from "path";

export function findWorkspaceRoot(start = process.cwd(), trace = false): string | null {
  let current = start;

  while (true) {
    if (fs.existsSync(path.join(current, ".genos"))) return current;

    const parent = path.dirname(current);
    if (parent === current) return null;

    current = parent;
  }
}