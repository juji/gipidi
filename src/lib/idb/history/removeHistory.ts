
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { Convo } from '../types';

export async function removeHistory( 
  convos: Convo[],
  connection?: Connection 
){

  const conn = connection || createConnection()
  const ids = convos.map(v => v.id)
  await Promise.all([
    conn.remove({
      from: TABLES.CONVO_DETAIL,
      where: {
        id: {
          in: ids
        },
        deleted: { '!=': DEFAULT_DELETED }
      }
    }),
    conn.remove({
      from: TABLES.CONVO,
      where: {
        id: {
          in: ids
        },
        deleted: { '!=': DEFAULT_DELETED }
      }
    })
  ])

  if(!connection) conn.terminate()

}