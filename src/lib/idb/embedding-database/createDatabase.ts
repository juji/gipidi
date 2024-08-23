
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { EmbeddingsDb } from '../types';

export async function createDatabase(
  data: EmbeddingsDb,
  connection?: Connection
){

  const conn = connection || createConnection()

  const db: EmbeddingsDb = {
    ...data,
    created: new Date()
  }

  const res = await conn.insert<EmbeddingsDb>({
    into: TABLES.EMBEDDINGS_DB,
    values: [db]
  })

  if(!connection) conn.terminate()

  return res


}