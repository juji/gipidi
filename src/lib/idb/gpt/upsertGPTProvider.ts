
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { GPTProvider } from '../types';

export async function upsertGPTProvider(
  id: GPTProvider['id'],
  setting: GPTProvider['setting'],
  connection?: Connection 
){

  const conn = connection || createConnection()

  const gptProvider: GPTProvider = {
    id,
    setting,
    created: new Date(),
    updated: new Date(),
    deleted: DEFAULT_DELETED
  }

  await conn.insert({
    into: TABLES.GPT_PROVIDER,
    upsert: true,
    values: [gptProvider]
  })

  if(!connection) conn.terminate()
  return gptProvider

}