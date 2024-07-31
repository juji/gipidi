
import { Connection } from '@juji/jsstore';
import { createConnection } from './connection'

export async function drop( connection?: Connection ){

  const conn = connection ? connection : createConnection()
  await conn.dropDb()

}