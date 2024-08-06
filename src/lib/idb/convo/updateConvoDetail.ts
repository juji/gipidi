
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { ConvoDetail } from '../types';

export async function updateConvoDetail(
  detail: ConvoDetail,
  connection?: Connection
){

  const conn = connection || createConnection()

  const i = await conn.update({
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

  console.log('update info', i)

  if(!connection) conn.terminate()

}