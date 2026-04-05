import { Model } from "./Resources";

export interface GenosConfig {
    version: string;
    languageModels?: Record<string, Model>;
    embeddings?: Record<string, Model>;
    tools?: Record<string, any>;
}
