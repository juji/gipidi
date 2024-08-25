import { createVector } from '@/lib/embeddings/createVector'
import { getEmbeddingById } from '../idb/embedding/getEmbeddingById'
import { query as chromaDbQuery } from '@/lib/embeddings/chromadb'
import { getEmbeddingResults } from './getEmbeddingResults'
import { ConvoData } from '../idb/types'


export async function loadEmbeddings(
  embeddingId: string,
  text: string
): Promise<ConvoData['embeddings']> {

  
  const { embedding, database } = await getEmbeddingById(embeddingId)
  const v = await createVector(text, embedding.vendor, embedding.model)
  const query = embedding.dbVendor === 'chromadb' ? chromaDbQuery : null
  if(!query) return []
  const results = await query({
    embedding: embedding,
    database: database,
    vector: v
  }).then(v => getEmbeddingResults(v, embedding))
  
  return results.map(v => v.doc)

}
