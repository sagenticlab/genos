import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, RAGNode } from "../../../models/Nodes";
import { RetrivalAugmentedGeneration } from "../../rag/storage"

export const ragNodeHandler = async (node: GraphNode, state: ExecutionState, models: string[], knowledge: string[]): Promise<ExecutionState> => {
    const ragNode = node as RAGNode;
    // Here you would implement the logic to perform RAG operations
    // For now, we will just log the RAG operation

    if(!state.config.embeddingModels) {
      throw new Error(`No knowledge configured in genos.config.json`);
    }

    const embeddingModel: string = models.find(model => model === ragNode.model) as string;
    if (!embeddingModel) {
      throw new Error(`Embedding model not found: ${ragNode.model}`);
    }

    const embeddingModelResource = (state.config.embeddingModels as Record<string, any>)[embeddingModel];

    if (!embeddingModelResource) {
      throw new Error(`Embedding Model resource not found in config: ${ragNode.model}`);
    }

    const knowledgeBase = knowledge.find(model => model === ragNode.knowledge);
    if (!knowledgeBase) {
      throw new Error(`Knowledge base not found in resources: ${ragNode.knowledge}`);
    }
    if(state.trace) {
      console.log(`Performing RAG operation with source: ${ragNode.input} and embedding: ${ragNode.knowledge}`);
    }
    const rag = new RetrivalAugmentedGeneration(knowledgeBase, embeddingModelResource.model, embeddingModelResource.endpoint);
    // const queryEmbedding = await rag.embed(state.data[ragNode.input]);
    const results = await rag.searchEmbedding(state.data[ragNode.input]);

    const context = results.map((r: any) => r.text).join("\n\n");
    if(state.trace) {
      console.log("RAG context:", context);
    }
    state.data[ragNode.output] = context;
    return state;
};