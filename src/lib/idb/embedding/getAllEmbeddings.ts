
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { Embeddings } from '../types';

export async function getAllEmbeddings(
  connection?: Connection
){

  const conn = connection || createConnection()

  const res = await conn.select<Embeddings>({
    from: TABLES.EMBEDDINGS
  })

  if(!connection) conn.terminate()

  return res


}