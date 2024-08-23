
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { EmbeddingsDb, EmbeddingsDbWithCount } from '../types';

export async function getAllDatabase(
  options?: { withCount: boolean },
  connection?: Connection,
): Promise<EmbeddingsDb[]|EmbeddingsDbWithCount[]>{

  const conn = connection || createConnection()

  let results = await conn.select<EmbeddingsDb>({
    from: TABLES.EMBEDDINGS_DB,
    where: {
      deleted: DEFAULT_DELETED
    },
    order: {
      by: 'created',
      type: 'desc' //supprted sort type is - asc,desc
    }
  });

  const { withCount } = options || {}

  if(withCount){
    await Promise.all(
      results.map(v => {

        return conn.count({
          from: TABLES.EMBEDDINGS,
          where: {
            db: v.id,
            deleted: DEFAULT_DELETED
          }
        })

      })
    ).then(map => {
      map.forEach((m,i) => {
        results[i] = {
          ...results[i], 
          count: m || 0
        } as EmbeddingsDbWithCount
      })
      return map
    })
  }

  if(!connection) conn.terminate()
  return results


}