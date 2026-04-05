export interface Chunk {
  id: string;
  text: string;
  source: string;
  start: number;
  end: number;
  embedding?: number[];
}