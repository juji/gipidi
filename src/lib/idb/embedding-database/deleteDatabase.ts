
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { EmbeddingsDb } from '../types';

export async function deleteDatabase(
data: EmbeddingsDb,
  connection?: Connection
){

  const conn = connection || createConnection()

  const db: EmbeddingsDb = {
    ...data,
    created: new Date()
  }

  const res = await conn.remove({
    from: TABLES.EMBEDDINGS_DB,
    where: {
      id: data.id
    }
  })

  if(!connection) conn.terminate()

  return res


}