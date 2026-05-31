import { Model } from "./Resources";

export interface GenosConfig {
    version: string;
    languageModels?: Record<string, Model>;
    embeddingModels?: Record<string, Model>;
    tools?: Record<string, any>;
}
