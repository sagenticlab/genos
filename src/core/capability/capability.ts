export interface Capability {
    name: string;
    description: string;
    execute: (config: Record<string, any>, trace: boolean) => Promise<Record<string, any>>;
    getSchema?: () => Record<string, any>;
}