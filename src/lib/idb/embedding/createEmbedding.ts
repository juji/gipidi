
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { Embeddings } from '../types';

export async function createEmbedding(
  data: Embeddings,
  connection?: Connection
){

  const conn = connection || createConnection()

  const embedding: Embeddings = {
    ...data,
    created: new Date()
  }

  const res = await conn.insert<Embeddings>({
    into: TABLES.EMBEDDINGS,
    values: [embedding],
    return: true
  })

  if(!connection) conn.terminate()
  
  return (res as Embeddings[])[0]


}