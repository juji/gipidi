import { Embeddings } from "../idb/types";


export function getEmbeddingResults( result: any, embedding: Embeddings ){

  let res : {id: string, doc: string}[] = [];
  
  if(embedding.dbVendor === 'chromadb'){
    const docs = result.documents.flat()
    const ids = result.ids.flat()
    res = docs.map((v:any,i:number) => ({
      id: ids[i],
      doc: v
    }))
  }

  return res
}