
import { Connection } from '@juji/jsstore';
import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { nanoid } from 'nanoid'
import { Convo, ConvoDetail, GPTProvider, ConvoData, ConvoAttachment } from '../types';

export async function createConvo(
  initialContent: string,
  provider: GPTProvider['id'],
  providerIcon: string,
  model : string,
  files?: ConvoAttachment[],
  systemPrompt?: string,
  currentTitle?: string,
  connection?: Connection 
){

  const conn = connection || createConnection()

  const convo: Convo = {
    id: nanoid(),
    created: new Date(),
    title: currentTitle || '',
    deleted: DEFAULT_DELETED
  }

  const convoDetail: ConvoDetail = {
    id: convo.id,
    created: new Date(),
    data: [
      ...systemPrompt ? [{
        id: nanoid(),
        lastUpdate: new Date(),
        role: 'system' as ConvoData['role'],
        content: systemPrompt
      }] : [],
      {
        id: nanoid(),
        lastUpdate: new Date(),
        role: 'user' as ConvoData['role'],
        content: initialContent,
        ...files ? {attachments: files} : {}
      }
    ],
    provider,
    providerIcon,
    model,
    systemPrompt: systemPrompt || '',
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