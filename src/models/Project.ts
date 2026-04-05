import { Graph } from "./Graph";
import { Resources } from "./Resources";

export interface Project {
  id: string;
  name: string;
  description?: string;

  graph: Graph;

  resources?: Resources;

  entryNode: string;
}
