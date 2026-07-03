export interface Capability {
    name: string;
    description: string;
    execute: (parameters: Record<string, any>, trace: boolean) => Promise<Record<string, any>>;
    getSchema?: () => Record<string, any>;
    validateParameters?: (parameters: Record<string, any>) => { status: boolean; message?: string };
}