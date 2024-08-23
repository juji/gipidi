
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { EmbeddingsDb } from '../types';

export async function getDatabaseById(
  id: string,
  connection?: Connection,
){

  const conn = connection || createConnection()

  let results = await conn.select<EmbeddingsDb>({
    from: TABLES.EMBEDDINGS_DB,
    where: {
      id,
      deleted: DEFAULT_DELETED
    },
    order: {
      by: 'created',
      type: 'desc' //supprted sort type is - asc,desc
    }
  });

  if(!connection) conn.terminate()
  return results[0]


}