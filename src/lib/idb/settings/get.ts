
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'

export async function getSetting( id: string, connection?: Connection ){

  const conn = connection ? connection : createConnection()
  const setting = await conn.select({
    from: TABLES.SETTINGS,
    where: {
      id
    }
  });

  if(!connection) conn.terminate()
  return setting[0]

}