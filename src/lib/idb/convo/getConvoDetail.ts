
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import type { Convo, ConvoDetail } from '../types';

export async function getConvoDetail( 
  convo: Convo,
  connection?: Connection 
){

  const conn = connection || createConnection()
  var results = await conn.select<ConvoDetail>({
    from: TABLES.CONVO_DETAIL,
    where: {
      id: convo.id,
      deleted: DEFAULT_DELETED
    }
  });

  if(!connection) conn.terminate()
  return results[0]

}