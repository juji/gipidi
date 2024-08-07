
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'

export async function setSetting( 
  id: string,
  data: any,
  connection?: Connection 
){

  const conn = connection || createConnection()

  await conn.insert({
    into: TABLES.SETTINGS,
    upsert: true,
    values: [{ id, data }]
  })

  if(!connection) conn.terminate()

}