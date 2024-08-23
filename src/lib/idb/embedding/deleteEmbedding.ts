
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { Embeddings } from '../types';

export async function deleteEmbedding(
  data: Embeddings,
  connection?: Connection
){

  const conn = connection || createConnection()

  const res = await conn.remove({
    from: TABLES.EMBEDDINGS,
    where: {
      id: data.id
    }
  })

  if(!connection) conn.terminate()
  
  return res


}