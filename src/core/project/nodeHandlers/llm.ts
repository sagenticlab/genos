import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, LLMNode } from "../../../models/Nodes";
import { Model } from "../../../models/Resources";

export const llmNodeHandler = async (node: GraphNode, state: ExecutionState, models: string[]): Promise<ExecutionState> => {
    const llmNode = node as LLMNode;
    // Here you would implement the logic to call the LLM with the given prompt
    // For now, we will just log the prompt

    if (!state.config.languageModels) {
      throw new Error(`No Language Models configured in genos.config.json`);
    }

    const llmModel = models.find(model => model === llmNode.model);
    if (!llmModel) {
      throw new Error(`LLM model not found in resources: ${llmNode.model}`);
    }

    const llmResource = (state.config.languageModels as Record<string, any>)[llmModel] as Model;
    
    if (!llmResource) {
      throw new Error(`LLM resource not found in config: ${llmNode.model}`);
    }

    // console.log(`input keys for LLM: ${llmNode.input.join(", ")}`);
    let llmPrompt = '';
    if(llmNode.systemContext) {
      llmPrompt = llmPrompt + `
System Context: ${llmNode.systemContext ?? "Use the context below to answer the question."}
      `;
    }

    if(llmNode.context) {
        llmPrompt = llmPrompt + `
Context:${state.data[llmNode.context] ?? "No context data found."}
      `;
    }

    if(llmPrompt) {
      llmPrompt = llmPrompt + `
Prompt: ${llmNode.input.map(inputKey => state.data[inputKey]).join(", ")}
      `;
    }
    if(state.trace) {
      console.log(`LLM Model: ${llmNode.model}`);
      console.log(`LLM Endpoint: ${llmResource.endpoint}`);
      console.log(`LLM Prompt: ${llmPrompt}`);
    }
    state.data[llmNode.output] = await promptLlm(llmResource.endpoint, llmResource.model, llmPrompt, state.trace);
    return state;
};

async function promptLlm(url: string, model: string, prompt: string, trace = false): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get LLM response: " + (await response.text()));
  }

  const decoder = new TextDecoder();
  let llmResponse = "";
  const reader = response.body!.getReader();
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const textChunk = decoder.decode(value);
      const jsonChunk = JSON.parse(textChunk);
      llmResponse += jsonChunk.response;
      if(trace) {
        process.stdout.write(jsonChunk.response);
      }
    }
  }
  return llmResponse;
}