
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from './connection'
import type { ConvoDetail } from './types';

export async function updateConvoDetail(
  detail: ConvoDetail,
  connection?: Connection
){

  const conn = connection || createConnection()

  await conn.update({
    in: TABLES.CONVO_DETAIL,
    set: {
      ...detail,
      updated: new Date()
    },
    where: {
      id: detail.id,
      deleted: DEFAULT_DELETED
    },
  })

  if(!connection) conn.terminate()

}