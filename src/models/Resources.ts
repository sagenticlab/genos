export interface Resources {
    models?: string[];      // allowed llm IDs
    embeddings?: string[];  // attached RAGs
    tools?: string[];       // allowed tools
}

export interface Model {
    type: 'local' | 'cloud';
    provider: string; // Unique identifier for the LLM
    model: string; // Model name or identifier
    endpoint: string; // Base URL of the LLM API
}