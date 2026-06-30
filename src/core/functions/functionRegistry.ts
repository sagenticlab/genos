import { FUNCTIONS } from "./functions";

export interface FunctionDefinition {
  name: string;
  description: string;
  body: Function;
}

export class FunctionRegistry {
    private functions = new Map<string, Function>();
    constructor() {
        // Register builtin functions
        for (const fn of FUNCTIONS) {
            this.register(fn.name, fn.body);
        }
    }

    register(name: string, func: Function) {
        this.functions.set(name, func);
    }


    get(name: string): Function {
        const func = this.functions.get(name);
        if (!func) throw new Error(`Function '${name}' not found`);
        return func;
    }

    list() {
        return Array.from(this.functions.keys());
    }   

    has(name: string): boolean {
        return this.functions.has(name);
    }
}