import { Capability } from "./capability";

export class CapabilityRegistry {
    private capabilities: Map<string, Capability> = new Map();
    public register(capability: Capability) {
        if (this.capabilities.has(capability.name)) {
            throw new Error(`Capability with name '${capability.name}' is already registered.`);
        }
        this.capabilities.set(capability.name, capability);
    }

    public get(name: string): Capability {
        const capability = this.capabilities.get(name); 
        if (!capability) {
            throw new Error(`Capability with name '${name}' is not registered.`);
        }
        return capability;
    }
}