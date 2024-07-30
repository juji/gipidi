
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from './connection'
import type { Convo } from './types';

export async function getAllConvo( connection?: Connection ){

  const conn = connection ? connection : createConnection()
  var results = await conn.select<Convo>({
    from: TABLES.CONVO,
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