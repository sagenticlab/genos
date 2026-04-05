import fs from "fs";
import path from "path";
import { Chunk } from "../../models/Chunk";
import { findWorkspaceRoot } from "../utils/findWorkspaceRoot";

export class RetrivalAugmentedGeneration {

  private _model: string;
  private _url: string;
  private _dbFile: string;
  constructor(name: string, model: string, url: string) {
    const workspace = findWorkspaceRoot();
    if (!workspace) {
      throw new Error("No GenOS workspace found.");
    }
    this._model = model;
    this._url = url;
    this._dbFile = path.join(workspace, ".genos", "vectors", `${name}.json`);

  }

  public loadDB(): any[] {
    if (!fs.existsSync(this._dbFile)) return [];
    return JSON.parse(fs.readFileSync(this._dbFile, "utf8"));
  }

  public saveDB(data: any[]) {
    fs.writeFileSync(this._dbFile, JSON.stringify(data, null, 2));
  }

  public cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vector length mismatch");
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public async searchEmbedding(
    query: string,
    topK = 5
  ) {

    const vector = this.loadDB();
    const chunks = (vector as any).chunks || [];

    // 1️⃣ embed query
    const queryVector = await this.embed(query);

    // 2️⃣ compute similarity
    const scored = chunks.map((chunk: any) => ({
      ...chunk,
      score: this.cosineSimilarity(queryVector, chunk.embedding)
    }));

    // 3️⃣ sort
    scored.sort((a: any, b: any) => b.score - a.score);

    // 4️⃣ return top K
    return scored.slice(0, topK);
  }

  public async embed(text: string): Promise<number[]> {
    const response = await fetch(this._url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this._model,
        prompt: text
      })
    });

    if (!response.ok) {
      throw new Error("Failed to get embeddings: " + (await response.text()));
    }

    const data = await response.json() as { embedding: any };
    // console.log("Received embedding:", data);
    return data.embedding;
  }

  public chunkText(
    text: string,
    source: string,
    size = 1000,
    overlap = 200,
    prefix = "chunk"
  ): Chunk[] {
  
    const chunks: Chunk[] = [];
  
    let start = 0;
    let index = 0;
  
    while (start < text.length) {
      const end = Math.min(start + size, text.length);
  
      chunks.push({
        id: `${prefix}-${index}`,
        text: text.slice(start, end),
        source,
        start,
        end
      });
  
      index++;
  
      if (end === text.length) break;
  
      start = end - overlap;
    }
  
    return chunks;
  }

}