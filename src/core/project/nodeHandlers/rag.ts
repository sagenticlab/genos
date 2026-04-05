import { ExecutionState } from "../../../models/ExecutionState";
import { GraphNode, RAGNode } from "../../../models/Nodes";
import { RetrivalAugmentedGeneration } from "../../rag/storage"

export const ragNodeHandler = async (node: GraphNode, state: ExecutionState, models: string[], embeddings: string[]): Promise<ExecutionState> => {
    const ragNode = node as RAGNode;
    // Here you would implement the logic to perform RAG operations
    // For now, we will just log the RAG operation

    if(!state.config.embeddings) {
      throw new Error(`No embeddings configured in genos.config.json`);
    }

    const embeddingModel: string = models.find(model => model === ragNode.model) as string;
    if (!embeddingModel) {
      throw new Error(`Embedding model not found: ${ragNode.model}`);
    }

    const embeddingResource = (state.config.embeddings as Record<string, any>)[embeddingModel];

    if (!embeddingResource) {
      throw new Error(`Embedding resource not found in config: ${ragNode.model}`);
    }

    const embedding = embeddings.find(model => model === ragNode.embedding);
    if (!embedding) {
      throw new Error(`Embedding not found: ${ragNode.embedding}`);
    }
    if(state.trace) {
      console.log(`Performing RAG operation with source: ${ragNode.input} and embedding: ${ragNode.embedding}`);
    }
    const rag = new RetrivalAugmentedGeneration(embedding, embeddingResource.model, embeddingResource.endpoint);
    // const queryEmbedding = await rag.embed(state.data[ragNode.input]);
    const results = await rag.searchEmbedding(state.data[ragNode.input]);

    const context = results.map((r: any) => r.text).join("\n\n");
    if(state.trace) {
      console.log("RAG context:", context);
    }
    state.data[ragNode.output] = context;
    return state;
};