
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { Convo } from '../types';

export async function updateConvo(
  convo: Convo,
  connection?: Connection
){

  const conn = connection || createConnection()

  await conn.update({
    in: TABLES.CONVO,
    set: {
      ...convo,
      updated: new Date()
    },
    where: {
      id: convo.id,
      deleted: DEFAULT_DELETED
    },
  })

  if(!connection) conn.terminate()

}