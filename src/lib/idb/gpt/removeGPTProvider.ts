
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES } from '../connection'
import { GPTProvider } from '../types';

export async function removeGPTProvider(
  id: GPTProvider['id'],
  connection?: Connection 
){

  const conn = connection || createConnection()

  await conn.remove({
    from: TABLES.GPT_PROVIDER,
    where: {
      id
    }
  })

  if(!connection) conn.terminate()

}