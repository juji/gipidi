
import { Connection } from '@juji/jsstore';
import { createConnection, DEFAULT_DELETED, TABLES } from '../connection'
import { Embeddings, EmbeddingsDb } from '../types';

export async function getEmbeddingById(
  id: string,
  connection?: Connection
){

  const conn = connection || createConnection()

  const res = await conn.select<Embeddings>({
    from: TABLES.EMBEDDINGS,
    where: {
      id,
      deleted: DEFAULT_DELETED
    }
  })

  const em = res[0]
  if(!em) throw new Error('Not Found')

  let db = await conn.select<EmbeddingsDb>({
    from: TABLES.EMBEDDINGS_DB,
    where: {
      id: em.db,
      deleted: DEFAULT_DELETED
    },
    order: {
      by: 'created',
      type: 'desc' //supprted sort type is - asc,desc
    }
  });

  if(!db.length) throw new Error('Embedding db is unknown')

  if(!connection) conn.terminate()

  return {
    embedding: em,
    database: db[0]
  }


}