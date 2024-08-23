import { EmbeddingsDb } from "./idb/types";

export function dbTypeToCased(type: string){
  return type === 'chromadb' ? 'ChromaDB' : 
    type === 'postgres' ? 'PostgreSQL' : 
    type === 'redis' ? 'Redis' : type
}