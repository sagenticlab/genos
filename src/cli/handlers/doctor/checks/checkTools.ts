import fs from "fs";
import { DoctorCheckResult } from "../doctor";
import { CapabilityRegistry } from "../../../../core/capability/capabilityRegistry";
import { HttpCapability } from "../../../../core/capability/httpCapability";

export async function checkTools(workspace: string): Promise<DoctorCheckResult> {
  const messages: string[] = [];
  let ok = true;

  const capabilityRegistry = new CapabilityRegistry();
      capabilityRegistry.register(new HttpCapability());

  // Validate tools in the genos.config.json file

  try {
    const configContent = await fs.promises.readFile(`${workspace}/genos.config.json`, "utf-8");
    const config = JSON.parse(configContent);

    if (config.tools) {
        Object.keys(config.tools).forEach(toolName => {
            const tool = config.tools[toolName];
        if (!tool.type || !tool.parameters) {
          ok = false;
          messages.push(`✗ Tool ${toolName || "unknown"} is missing required fields (type, parameters)`);
        } else {
          const validationResult = capabilityRegistry.get(tool.type)?.validateParameters?.(tool.parameters);
          if (validationResult && !validationResult.status) {
            ok = false;
            messages.push(`✗ Tool ${toolName} has invalid parameters: ${validationResult.message}`);
          } else {
            messages.push(`✓ Tool ${toolName} is valid`);
          }
        }
      });
    }
  } catch (error) {
    messages.push("Error reading genos.config.json");
    ok = false;
  }

  console.log("Tool check completed. Results:", { ok, messages });

  return {
    name: "Tools",
    ok,
    messages
  };
}