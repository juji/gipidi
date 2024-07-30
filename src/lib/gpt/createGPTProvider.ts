
import { Connection } from '@juji/jsstore';
import { createConnection, DEFAULT_DELETED } from './connection'
import { GPTProvider } from './types';

export async function createGPTProvider(
  id: GPTProvider['id'],
  setting: GPTProvider['setting'],
  connection?: Connection 
){

  const conn = connection || createConnection()

  const gptProvider: GPTProvider = {
    id,
    setting,
    created: new Date(),
    deleted: DEFAULT_DELETED
  }

  if(!connection) conn.terminate()
  return gptProvider

}