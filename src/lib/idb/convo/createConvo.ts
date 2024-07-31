
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { nanoid } from 'nanoid'
import { Convo, ConvoDetail } from '../types';
import { ls } from '@/lib/local-storage';

export async function createConvo(
  connection?: Connection 
){

  const conn = connection || createConnection()

  const defaultProvider = ls.getDefaultProvider()
  const defaultModel = ls.getDefaultModel()

  if(!defaultProvider)
    throw new Error('defaultProvider is empty')
  if(!defaultModel)
    throw new Error('defaultModel is empty')

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
    provider: defaultProvider,
    model: defaultModel,
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