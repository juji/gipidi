
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { GPTProvider } from '../types';

export async function getGPTProvider( id:GPTProvider['id'], connection?: Connection ){

  const conn = connection ? connection : createConnection()
  const results = await conn.select<GPTProvider>({
    from: TABLES.GPT_PROVIDER,
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