export interface Resources {
    models?: string[];      // allowed llm IDs
    knowledge?: string[];  // attached RAGs
    tools?: string[];       // allowed tools
    functions?: string[];   // allowed functions
}

export interface Model {
    type: 'local' | 'cloud';
    provider: string; // Unique identifier for the LLM
    model: string; // Model name or identifier
    endpoint: string; // Base URL of the LLM API
}