import { loadProjectConfig } from "../utils/loadProjectConfig";

export function validateGraph(graph: any): void {
  const { nodes, edges } = graph;

  if (!nodes || typeof nodes !== "object") {
    throw new Error("Graph must contain nodes");
  }

  if (!Array.isArray(edges)) {
    throw new Error("Graph must contain edges array");
  }

  // ---- ENTRY VALIDATION ----
  if (!nodes["start"]) {
    throw new Error("Graph must contain a 'start' node");
  }

  const nodeIds = new Set(Object.keys(nodes));

  // ---- EDGE TARGET VALIDATION ----
  for (const edge of edges) {
    if (!nodeIds.has(edge.from)) {
      throw new Error(`Edge source '${edge.from}' does not exist`);
    }

    if (edge.to !== "__end__" && !nodeIds.has(edge.to)) {
      throw new Error(`Edge target '${edge.to}' does not exist`);
    }
  }

  // ---- BUILD OUTGOING MAP ----
  const outgoing = new Map<string, any[]>();

  for (const edge of edges) {
    if (!outgoing.has(edge.from)) {
      outgoing.set(edge.from, []);
    }
    outgoing.get(edge.from)!.push(edge);
  }

  // ---- EDGE RULE VALIDATION ----
  for (const [nodeId, node] of Object.entries(nodes)) {
    const outs = outgoing.get(nodeId) || [];

    if (outs.length === 0 && nodeId !== "__end__") {
      throw new Error(`Node '${nodeId}' has no outgoing edges`);
    }

    if (outs.length === 1) {
      if (outs[0].condition) {
        throw new Error(
          `Node '${nodeId}' has only one edge but it contains a condition`
        );
      }
    }

    if (outs.length > 1) {
      // All must have conditions
      for (const edge of outs) {
        if (!edge.condition) {
          throw new Error(
            `Node '${nodeId}' has multiple edges but some lack condition`
          );
        }
      }

      // Condition keys must be unique
      const keys = new Set();
      for (const edge of outs) {
        const condKey = `${edge.condition.input}:${edge.condition.key}`;
        if (keys.has(condKey)) {
          throw new Error(
            `Duplicate condition '${condKey}' on node '${nodeId}'`
          );
        }
        keys.add(condKey);
      }
    }
  }

  // ---- MODULE NODE VALIDATION ----
  for (const [nodeId, node] of Object.entries(nodes)) {
    if ((node as any).type === "module") {
      const moduleNode = node as any;
      const subProjectId = moduleNode.module;

      if (!subProjectId) {
        throw new Error(`Module node '${nodeId}' missing required 'module' field`);
      }

      const subProject = loadProjectConfig(subProjectId, false);
      if (!subProject) {
        throw new Error(`Module node '${nodeId}' references non-existent project '${subProjectId}'`);
      }

      if (!subProject.graph) {
        throw new Error(`Module project '${subProjectId}' has no graph defined`);
      }

      // Recursively validate subgraph
      validateGraph(subProject.graph);
    }
  }

  // ---- CONDITION INPUT VALIDATION ----
  const producedOutputs = new Set<string>();

  for (const node of Object.values(nodes) as any[]) {
    if (node.output) {
      producedOutputs.add(node.output);
    }
  }

  for (const edge of edges) {
    if (edge.condition) {
      if (!producedOutputs.has(edge.condition.input)) {
        throw new Error(
          `Condition input '${edge.condition.input}' is never produced by any node`
        );
      }
    }
  }

  // ---- REACHABILITY CHECK ----
  const visited = new Set<string>();
  const stack = ["start"];

  while (stack.length) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;

    visited.add(current);

    const outs = outgoing.get(current) || [];
    for (const edge of outs) {
      if (edge.to !== "__end__") {
        stack.push(edge.to);
      }
    }
  }

  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      throw new Error(`Node '${nodeId}' is unreachable from start`);
    }
  }

  // ---- END REACHABILITY ----
  const endReachable = edges.some(
    (e) => visited.has(e.from) && e.to === "__end__"
  );

  if (!endReachable) {
    throw new Error("Graph has no path to '__end__'");
  }

  console.log("✅ Graph validation successful");
}