import { Graph } from "./Graph";
import { Resources } from "./Resources";

export interface Project {
  id: string;
  name: string;
  description?: string;
  inputs?: string[]; // list of required input keys for the project
  outputs?: string[]; // list of expected output keys from the project

  graph: Graph;

  resources?: Resources;

  entryNode: string;
}
