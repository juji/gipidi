
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from './connection'
import type { Convo } from './types';

export async function deleteConvo(
  convo: Convo,
  connection?: Connection 
){

  const conn = connection || createConnection()

  await Promise.all([
    conn.update({
      in: TABLES.CONVO_DETAIL,
      set: { deleted: new Date() },
      where: {
        id: convo.id,
        deleted: DEFAULT_DELETED
      },
    }),
    conn.update({
      in: TABLES.CONVO,
      set: { deleted: new Date() },
      where: {
        id: convo.id,
        deleted: DEFAULT_DELETED
      },
    })
  ])

  if(!connection) conn.terminate()


}