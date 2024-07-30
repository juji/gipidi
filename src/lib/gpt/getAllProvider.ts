
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from './connection'
import type { GPTProvider } from './types';

export async function getAllProvider( connection?: Connection ){

  const conn = connection ? connection : createConnection()
  var results = await conn.select<GPTProvider>({
    from: TABLES.GPT,
    where: {
      deleted: DEFAULT_DELETED
    },
    order: {
      by: 'created',
      type: 'desc' //supprted sort type is - asc,desc
    }
  });

  if(!connection) conn.terminate()
  return results

}