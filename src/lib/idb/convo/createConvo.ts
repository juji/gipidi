
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { nanoid } from 'nanoid'
import { Convo, ConvoDetail } from '../types';

export async function createConvo(
  connection?: Connection 
){

  const conn = connection || createConnection()

  const convo: Convo = {
    id: nanoid(),
    created: new Date(),
    title: '',
    deleted: DEFAULT_DELETED
  }

  const convoDetail: ConvoDetail = {
    id: convo.id,
    created: new Date(),
    data: [],
    deleted: DEFAULT_DELETED
  }

  await Promise.all([
    conn.insert({
      into: TABLES.CONVO,
      values: [convo]
    }),
    conn.insert({
      into: TABLES.CONVO_DETAIL,
      values: [convoDetail]
    })
  ])

  if(!connection) conn.terminate()

  return {
    convo,
    convoDetail
  }


}