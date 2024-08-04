
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { Convo } from '../types';

export async function restoreHistory( 
  convos: Convo[],
  connection?: Connection 
){

  const conn = connection || createConnection()
  const ids = convos.map(v => v.id)
  await Promise.all([
    conn.update({
      in: TABLES.CONVO_DETAIL,
      set: {
        deleted: DEFAULT_DELETED
      },
      where: {
        id: { in: ids },
        deleted: { '!=': DEFAULT_DELETED }
      }
    }),
    conn.update({
      in: TABLES.CONVO,
      set: {
        deleted: DEFAULT_DELETED
      },
      where: {
        id: { in: ids },
        deleted: { '!=': DEFAULT_DELETED }
      }
    })
  ])

  if(!connection) conn.terminate()

}