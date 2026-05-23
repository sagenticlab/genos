import { execSync } from "child_process";
import { loadSystemConfig } from "../../../core/utils/loadSystemConfig";
import { findWorkspaceRoot } from "../../../core/utils/findWorkspaceRoot";

export async function setup(options: { default?: boolean }) {
    const prompts = await import("@inquirer/prompts");
    const { input, checkbox, confirm, select } = prompts;
    console.log("\nSetting up GenOS...\n");

    // Check if Ollama is installed and running

    // const ollamaInstalled = await checkOllamaInstalled();
    // if (ollamaInstalled) {
    //     console.log("Ollama is running.");
    //     return;
    // }

    // Select Language Models to install

    const LANGUAGE_MODELS = [
        {
            name: "phi3",
            description: "Lightweight Microsoft SLM"
        },
        {
            name: "llama3",
            description: "Meta general-purpose model"
        },
        {
            name: "mistral",
            description: "Fast reasoning model"
        },
        {
            name: "qwen2.5",
            description: "Strong multilingual model"
        }
    ];
    
    let selectedLanguageModels: string[];
    
    if (options?.default) {
        selectedLanguageModels = ["phi3"];
        console.log("Using default language model: phi3");
    } else {
        selectedLanguageModels = await checkbox({
            message: "Select language models",
            choices: LANGUAGE_MODELS.map((m) => ({
                name: `${m.name} - ${m.description}`,
                value: m.name,
                default: m.name === "phi3" // pre-select the recommended model
            }))
        });
    }
    
    // Select Embedding Models to install
    const EMBEDDING_MODELS = [
        {
            name: "mxbai-embed-large",
            description: "High quality embeddings"
        },
        {
            name: "nomic-embed-text",
            description: "Recommended embedding model"
        }
    ];
    
    let selectedEmbeddingModels: string[];
    
    if (options?.default) {
        selectedEmbeddingModels = ["mxbai-embed-large"];
        console.log("Using default embedding model: mxbai-embed-large");
    } else {
        selectedEmbeddingModels = await checkbox({
            message: "Select embedding models",
            choices: EMBEDDING_MODELS.map((m) => ({
                name: `${m.name} - ${m.description}`,
                value: m.name,
                default: m.name === "mxbai-embed-large" // pre-select the recommended model
            }))
        });
    }
    console.log("pulling models in Ollama...");

    console.log("Selected Language Models:", selectedLanguageModels);
    console.log("Selected Embedding Models:", selectedEmbeddingModels);

    // Pull selected models in Ollama

    for (const model of selectedLanguageModels) {
        execSync(`ollama pull ${model}`, {
            stdio: "inherit"
        });
    }

    for (const model of selectedEmbeddingModels) {
        execSync(`ollama pull ${model}`, {
            stdio: "inherit"
        });
    }

    execSync(`genos init`, {
        stdio: "inherit"
    });

    const workspaceRoot = findWorkspaceRoot();

    if (!workspaceRoot) {
        console.error("Not inside a GenOS workspace. Run 'genos init'.");
        process.exit(1);
    }

    const config = loadSystemConfig(workspaceRoot);
      
    if (!config) {
        console.error("No GenOS workspace found.");
        return;
    }

    console.log("Updating genos.config.json with selected models...");

    // Update genos.config.json with the new models and default endpoints
    for (const model of selectedLanguageModels) {
        config.languageModels = config.languageModels || {};
        console.log(`model: ${model}`);
        if (config.languageModels[model]) {
            console.log(`Model ${model} already exists in config, skipping...`);
            continue;
        }
        console.log(`Adding language model: ${model}`);
        config.languageModels[model] = {
            type: "local",
            provider: "ollama",
            model,
            endpoint: `http://localhost:11434/api/generate`
        };
    }

    for (const model of selectedEmbeddingModels) {
        config.embeddings = config.embeddings || {};
        if (config.embeddings[model]) {
            console.log(`Model ${model} already exists in config, skipping...`);
            continue;
        }
        console.log(`Adding embedding model: ${model}`);
        config.embeddings[model] = {
            type: "local",
            provider: "ollama",
            model,
            endpoint: `http://localhost:11434/api/embeddings`
        };
    }

    // console.log(config);

    // Write updated config back to genos.config.json
    const configPath = `${workspaceRoot}/genos.config.json`;
    require("fs").writeFileSync(configPath, JSON.stringify(config, null, 2));
}